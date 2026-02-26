# ⚡ SuperForm — monday.com Form Builder

A feature-rich form builder app for monday.com, similar to SuperForm on the Marketplace. Build powerful forms connected directly to your monday.com boards.

---

## Features

- **Advanced Form Builder** — Drag-and-drop form builder with 16+ field types
- **All Column Types** — Text, Email, Phone, Number, Date, Dropdown, Checkbox, Rating, Status, Tags, People, Hour, Week, World Clock, Dependency
- **Conditional Logic** — Show/hide fields based on other field values (unlimited branches)
- **Prefill Support** — Pre-populate form fields via URL parameters
- **Update Existing Items** — Update a monday.com item instead of creating a new one
- **Sub-items Support** — Add responses as sub-items to existing items
- **Custom Theming** — Custom primary color, background color, and font family
- **Submissions Dashboard** — View all form submissions with filtering
- **Multi-board** — Connect forms to any monday.com board

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, @dnd-kit |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (via Mongoose) |
| monday.com | monday-sdk-js + GraphQL API |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- monday.com developer account

### 1. Clone and install

```bash
git clone <repo-url>
cd superform-monday-app

# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install
```

### 2. Configure environment

```bash
# In /server, create .env
cp ../.env.example .env
# Edit .env with your MONGO_URI and CLIENT_URL

# In /client, create .env.local
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env.local
```

### 3. Run dev servers

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Routes

| Route | Description |
|---|---|
| `/` | Dashboard — list all forms for a board |
| `/builder` | Create a new form |
| `/builder/:formId` | Edit an existing form |
| `/form/:formId` | Public form view (for end users) |
| `/submissions/:formId` | View submissions for a form |

### Prefill via URL

Append field IDs as query params:
```
/form/<formId>?fieldId1=value1&fieldId2=value2
```

To update an existing item:
```
/form/<formId>?itemId=<mondayItemId>&fieldId1=prefillValue
```

---

## API Reference

### Forms
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/forms/board/:boardId` | List forms for a board |
| GET | `/api/forms/:formId` | Get a form |
| POST | `/api/forms` | Create a form |
| PUT | `/api/forms/:formId` | Update a form |
| DELETE | `/api/forms/:formId` | Delete a form |
| GET | `/api/forms/:formId/submissions` | Get submissions |

### Submissions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/submissions` | Submit a form response |

### monday.com Proxy
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/monday/boards` | List boards |
| GET | `/api/monday/boards/:id/columns` | Get board columns |
| GET | `/api/monday/boards/:id/items` | Get board items |
| POST | `/api/monday/boards/:id/items` | Create/sub-item |
| PUT | `/api/monday/boards/:id/items/:itemId` | Update item |

---

## Publishing to monday.com Marketplace

1. Create an app at [monday.com/developers](https://monday.com/developers)
2. Add a **Board View** feature pointing to your hosted frontend URL
3. Use the monday SDK to get the current board ID and user token
4. Submit for marketplace review

---

## License

MIT
