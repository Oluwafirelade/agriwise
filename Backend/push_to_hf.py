from huggingface_hub import login, HfApi, whoami

# 1. Login (This will use the token you just saved to your machine)
# login() 

try:
    # 2. Automatically get your correct username from the token
    user_info = whoami()
    username = user_info['name']
    print(f"✅ Logged in as: {username}")

    api = HfApi()
    
    # 3. Use the automatic username for the repo_id
    repo_id = f"{username}/agriadvisor-model" 
    
    print(f"Checking repository: {repo_id}...")
    # This creates the repo if it doesn't exist
    api.create_repo(repo_id=repo_id, repo_type="model", exist_ok=True)

    print("Uploading folder contents...")
    api.upload_folder(
        folder_path = r"C:\Users\USER\Documents\agriwise-main\Backend\kisan_vaani_model",
        repo_id     = repo_id,
        repo_type   = "model",
    )
    print(f"\n✅ Success! View your model at: https://huggingface.co/{repo_id}")

except Exception as e:
    print(f"❌ Upload failed: {e}")