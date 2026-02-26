import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

const mondayApi = async (token: string, query: string, variables?: Record<string, unknown>) => {
  const response = await axios.post(
    "https://api.monday.com/v2",
    { query, variables },
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "API-Version": "2024-01",
      },
    }
  );
  return response.data;
};

// Get boards for the current user
router.get("/boards", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const query = `query { boards(limit: 50) { id name description columns { id title type } } }`;
    const result = await mondayApi(token, query);
    res.json({ success: true, data: result.data?.boards || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch boards" });
  }
});

// Get columns for a board
router.get("/boards/:boardId/columns", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const query = `query($boardId: ID!) { boards(ids: [$boardId]) { columns { id title type settings_str } } }`;
    const result = await mondayApi(token, query, { boardId: req.params.boardId });
    const columns = result.data?.boards?.[0]?.columns || [];
    res.json({ success: true, data: columns });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch columns" });
  }
});

// Get items from a board (for prefill / update existing)
router.get("/boards/:boardId/items", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const query = `
      query($boardId: ID!) {
        boards(ids: [$boardId]) {
          items_page(limit: 100) {
            items {
              id
              name
              column_values { id text value }
              subitems { id name column_values { id text value } }
            }
          }
        }
      }
    `;
    const result = await mondayApi(token, query, { boardId: req.params.boardId });
    const items = result.data?.boards?.[0]?.items_page?.items || [];
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch items" });
  }
});

// Create an item on a board
router.post("/boards/:boardId/items", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const { itemName, columnValues, groupId, createSubItem, parentItemId } = req.body;

    if (createSubItem && parentItemId) {
      const query = `
        mutation($parentItemId: ID!, $itemName: String!, $columnValues: JSON) {
          create_subitem(parent_item_id: $parentItemId, item_name: $itemName, column_values: $columnValues) { id }
        }
      `;
      const result = await mondayApi(token, query, {
        parentItemId,
        itemName,
        columnValues: JSON.stringify(columnValues),
      });
      return res.json({ success: true, data: result.data?.create_subitem });
    }

    const query = `
      mutation($boardId: ID!, $itemName: String!, $columnValues: JSON, $groupId: String) {
        create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues, group_id: $groupId) { id name }
      }
    `;
    const result = await mondayApi(token, query, {
      boardId: req.params.boardId,
      itemName,
      columnValues: JSON.stringify(columnValues),
      groupId,
    });
    res.json({ success: true, data: result.data?.create_item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create item" });
  }
});

// Update an existing item
router.put("/boards/:boardId/items/:itemId", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const { columnValues } = req.body;
    const query = `
      mutation($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
        change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnValues) { id name }
      }
    `;
    const result = await mondayApi(token, query, {
      boardId: req.params.boardId,
      itemId: req.params.itemId,
      columnValues: JSON.stringify(columnValues),
    });
    res.json({ success: true, data: result.data?.change_multiple_column_values });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update item" });
  }
});

export default router;
