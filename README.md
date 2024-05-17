# AYC
Community platform for akurinu-youth.com
## Tech Stack
* React
* Firebase

## Setup

### 1. Installation

```bash
git clone https://github.com/DevSheila/akurinu-youth-client.git
```

```bash
cd akurinu-youth-client
```

```bash
npm install
```

### 2. Setup env

Create firebase app and add these details
```bash
REACT_APP_PUBLIC_FIREBASE_API_KEY="value"
REACT_APP_PUBLIC_FIREBASE_AUTH_DOMAIN="value"
REACT_APP_PUBLIC_FIREBASE_DATABASE_URL="value"
REACT_APP_PUBLIC_FIREBASE_PROJECT_ID="value"
REACT_APP_PUBLIC_FIREBASE_STORAGE_BUCKET="value"
REACT_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="value"
REACT_APP_PUBLIC_FIREBASE_APP_ID="value"
REACT_APP_PUBLIC_FIREBASE_MEASUREMENT_ID="value"
REACT_APP_PUBLIC_CRYPTO_SECRET_PASS="value"
```

### 3. Run app
```bash
npm run start
```

### 4. Deploy to cpanel
- Stop running app by pressing ctrl+C in terminal
- Run command below
```bash
npm run build
```
- Zip build folder generated in root folder
- Upload zipped folder to cpanel folder for community


## Features
* Sign up
* Login
* Logout
* Add post
    * Add image
    * Crop image (provided aspect ratio: original size, 16:9, 1:1)
    * Add/Edit/Empty image's ALT text
    * Add emoji
    * Add text 
* Delete post 
* Like post
* Unlike post
* Comment post
* Like comment
* Unlike comment
* Delete comment
* Add post's thread comment 
* Like  thread
* Unlike thread comment
* Delete thread comment 
* Follow other user
* Unfollow other user
* View user's profile
* View user's followings
* View user's followed
* View user's media
* Send image (just like post's facility such as Crop Image, add ALT Text)
* Send emoji
* Pop up image
* Edit Profile
    * Change profile theme/wallpaper
    * Change user's profile photo
    * Edit user's name
    * Edit user's bio
    * Edit Location
    * Edit user's website
