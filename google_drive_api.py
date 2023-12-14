from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load credentials from the downloaded JSON file
credentials = service_account.Credentials.from_service_account_file(
    r'C:\Users\sambl\Dropbox\PC\Downloads\bird-dom-scores-f3d2a9520bef.json',
    scopes=['https://www.googleapis.com/auth/drive']
)

# Create a Google Drive API service
service = build('drive', 'v3', credentials=credentials)

def get_file_path(service, file_id):
    path = []
    while True:
        file_metadata = service.files().get(fileId=file_id, fields='id, name, parents').execute()
        path.insert(0, file_metadata['name'])
        if 'parents' not in file_metadata or not file_metadata['parents']:
            break
        else:
            file_id = file_metadata['parents'][0]
    return '/'.join(path)



def explore_folder(service, folder_id, depth=0):
    # List files in the specified folder
    results = service.files().list(q=f"'{folder_id}' in parents").execute()
    files = results.get('files', [])

    if not files:
        print('No files found in the specified folder.')
    else:
        print(f'Contents of the folder (depth {depth}):')
        for file in files:
            if file['mimeType'] == 'application/vnd.google-apps.folder':
                # If it's a folder, explore its contents recursively
                print(f"Folder: {file['name']}")
                explore_folder(service, file['id'], depth + 1)
            else:
                # It's a file
                print(f"File: {file['name']} (ID: {file['id']})")

# Specify the root folder ID
root_folder_id = '13XPtd4eyIpS3quGEddHVv4JbJ0PUuhG1'
explore_folder(service, root_folder_id)

