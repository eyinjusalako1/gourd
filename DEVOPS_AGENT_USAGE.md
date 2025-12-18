# DevOps Assistant - How to Use

The DevOps Assistant is an internal agent that helps diagnose errors and propose fixes.

## API Endpoint

**POST** `/api/agents/DevOpsAssistant`

## Request Body

```json
{
  "error_log": "Error: Cannot read property 'id' of undefined\n    at Component (file.tsx:42:5)",
  "code_context": "// Your code snippet here\nconst user = props.user;\nreturn <div>{user.id}</div>;",
  "file_path": "src/components/MyComponent.tsx",
  "notes": "Optional additional context"
}
```

## Response

```json
{
  "agent": "DevOpsAssistant",
  "data": {
    "diagnosis": "The error occurs because props.user is undefined when the component renders.",
    "proposed_fix_explanation": "Add a null check before accessing user.id to prevent the error.",
    "patch_suggestion": "if (!props.user) return null;\nreturn <div>{props.user.id}</div>;",
    "pr_title": "Add null-check to prevent runtime error in MyComponent",
    "pr_description": "Adds a null-check around the user prop to prevent crashes when the user object is not yet loaded."
  }
}
```

## Example Usage

### Using cURL

```bash
curl -X POST https://your-app.vercel.app/api/agents/DevOpsAssistant \
  -H "Content-Type: application/json" \
  -d '{
    "error_log": "Error: Cannot read property id of undefined",
    "code_context": "const user = props.user;\nreturn <div>{user.id}</div>;",
    "file_path": "src/components/MyComponent.tsx"
  }'
```

### Using JavaScript/TypeScript

```typescript
const response = await fetch('/api/agents/DevOpsAssistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    error_log: "Error: Cannot read property 'id' of undefined",
    code_context: `
      const MyComponent = (props) => {
        const user = props.user;
        return <div>{user.id}</div>;
      };
    `,
    file_path: 'src/components/MyComponent.tsx',
  }),
});

const result = await response.json();
console.log(result.data);
```

## Mock Mode

If `GATHERED_MOCK_AGENTS=true` is set, it will return a mock response instead of calling the AI.

## Notes

- The agent is designed for internal use (not user-facing)
- It works best with clear error messages and relevant code context
- The agent will propose minimal, safe fixes
- It respects security checks and validation



