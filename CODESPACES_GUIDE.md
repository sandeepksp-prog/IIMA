# Codespaces Protocol: The Safe Harbour

## Why Codespaces?
We are moving the "Hands Layer" (Open Interpreter) to GitHub Codespaces to prevent any accidental damage to your local Windows environment and to ensure a consistent Linux environment for the Agent.

## Setup Instructions

1.  **Push Code**: Ensure all your latest changes (including `backend/` and `frontend/`) are pushed to your GitHub Repository.
2.  **Open Codespaces**:
    -   Go to your Repo on GitHub.
    -   Click the green **Code** button.
    -   Select **Codespaces** tab -> **Create codespace on main**.
3.  **Install Titan Tools** (Inside the Codespace Terminal):
    ```bash
    pip install open-interpreter
    ```
4.  **Launch the Agent**:
    ```bash
    interpreter --os
    ```

## Automated Ingestion Loop
When you want to ingest new PDFs:
1.  Upload the PDF to the Codespace (drag and drop).
2.  Tell Interpreter: *"Read this PDF and extract mindset vectors to Supabase using the backend/models.py logic."*

**Status**: ✅ Safe. Cloud-Native. Isolated.
