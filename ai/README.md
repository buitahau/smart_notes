## Development in local

```bash
cd ai_node_js
npm install
nvm use 20
npm run dev
```

## APIs

### Health check
```bash
GET /ping
```

Response:
```json
{
    "message": "pong"
}
```