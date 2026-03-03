# AutoBumper: Auto Insurance Management

# Internal Technical Documentation

 # Project Purpose
AutoBumper is a mobile application developed with React Native (Expo) designed to streamline Auto Insurance management. It allows users to browse insurance offers (Liability, CASCO, Auto Assistance), manage a cart of insurance products, and maintain a digital profile of their personal and vehicle information.

 # System Architecture
The application follows a Client-Server model:

. Client: React Native Mobile App (this project).

. Communication: Uses Axios as the HTTP client to perform GET, POST, and PUT requests to the Insurance API.

. Authentication: JWT (JSON Web Tokens). The server returns an accessToken which the app stores to authorize future requests.

 # Navigation & Security Logic
. The app implements Conditional Rendering at the root level. This is the most secure way to handle private insurance data.

. Unauthenticated (AuthStack): Only Login and Register screens are available. The Bottom Tab Bar is physically removed from the UI.

. Authenticated (AppStack): Once user state is present, the TabNavigator is mounted, granting access to:

 - Home: Insurance categories (Liability, Casco, etc.).

 - Cart: User-specific insurance selection.

 - Profile: Personal and Car data management.

  # Key Technical Features
User-Specific Data Persistence
 To ensure privacy in an insurance context, the app uses Key-Value Storage (AsyncStorage) with unique user IDs:

. Cart Storage: Saved as cart_${userId}. If "User A" logs out and "User B" logs in, the cart refreshes automatically to show only "User B's" items.

. Profile Image: Saved as profile_pic_${userId}. This allows the app to persist the user's photo even after they log out, re-associating it when they log back in.

. Safe Logout System
 
The logout process is centralized in the UserContext.

 State Reset: Sets user to null, which instantly hides the Tab Navigator.

 Storage Cleanup: Removes the userToken and userId but preserves the Insurance Cart and Profile Photo on the disk for the next session.

 # Screen Breakdown

. Screen	Functionality
. Login/Register	Uses KeyboardAvoidingView to handle input focus without UI overlap.
. Home	Entry point for Insurance types (Liability, CASCO, Assistance).
. OfferForm	Data entry for generating specific insurance policies.
. Profile	Manages ImagePicker for photos and TextInput for car/personal data.
. Cart	List of selected insurance offers pending checkout.


 # Navigation Architecture
The application uses React Navigation 6 to manage the user journey. The architecture is designed to be "State-First," meaning the UI reacts to the authentication state rather than manual redirects.

# Navigation Hierarchy
The app is structured in three layers:

- Root Switcher (App.js): Uses a conditional ternary operator to swap between the AuthNavigator and the TabNavigator.

- Tab Navigator (Main UI): The primary container for the authenticated experience, providing the bottom navigation bar.

- Home Stack Navigator: A nested stack within the "Home" tab that handles the deep-linking for insurance details and forms.


 Navigation Implementation Details
 # Nested Header Logic
The HomeStackNavigator is configured with screenOptions to provide a Global Logout Button. By placing the logout logic in the stack options rather than individual screens, we ensure the user can exit the app from any depth of the insurance offer flow.

 # Conditional Unmounting
When the user state becomes null (on logout):

. The TabNavigator is completely unmounted (removed from memory).

. The AuthStack is mounted.

. This prevents the "Back Button" vulnerability, ensuring a logged-out user cannot navigate back into private insurance screens.

 # Keyboard-Aware Navigation
All entry screens (Login/Register/OfferForm) utilize KeyboardAvoidingView. This ensures that when the keyboard opens, the navigation headers and active input fields remain visible to the user, preventing "UI clipping."

 # Navigation Map
Login → Register (and back)

Home (Tab)

→ LiabilityDetail → OfferForm

→ CascoDetail → OfferForm

→ AssistanceDetail → OfferForm

Cart (Tab) → Checkout 

Profile (Tab) → Camera/ImagePicker

 # Authentication Service (authApi) Handles the user lifecycle and security credentials.
    * POST/register Creates a new user. Returns accessToken and user object.
    * POST/loginAuthenticates credentials and returns a session token.
    * DELETE/users/${id}Destructive: Permanently deletes the login account record.

 # User Profile Service (userApi)Manages vehicle details and personal information for insurance policies.
    * GET/profiles?userId=${id} Fetches profile data filtered by the unique User ID.
    * POST/profilesCreates the initial insurance profile for a new user.
    * PUT/profiles/${id}Replaces the entire profile record with updated data.
    * DELETE/profiles/${id}Destructive: Removes car and personal data from the database.

# Insurance Categories & Rates (categoryApi)Fetches dynamic data used to calculate insurance premiums.
    * GET/categoriesList of all insurance types (Liability, Casco, etc.).
    * GET/civil_liability Specific rates and config for Mandatory Civil Liability.
    * GET/casco_config Configuration options for Full CASCO coverage.
    * GET/age_groups Multiplier data used for age-based price adjustments.
    * GET/assistance_europe_ratesPricing for International Roadside Assistance.

# Order & Transaction Service (orderService)Handles the final submission of insurance applications.
  * POST/orders Submits the insurance order to the backend.Authorization: Bearer {token}

# Cart Logic (Database Sync)While implemented via the CartContext using AsyncStorage for speed, the following endpoints are used for cross-device synchronization:
  * GET/cart/${userId}Retrieves saved insurance items from the cloud.
  * POST/cartUpdates the cloud database with the current local cart state.



# Development Setup
To run this project locally:

- Install dependencies: npm install
- Start Expo: npx expo start
- BackEnd: node server.js 

* Render BackEnd deployed URL: https://autobumper-gv9f.onrender.com/

* Build APK Expo link: https://expo.dev/accounts/h3x3n/projects/AutoBumper/builds/88fe1aa0-7a45-4514-a508-766f1e76290f

