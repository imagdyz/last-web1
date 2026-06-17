# STOMACH Medical Portal - API Documentation 🩺

This documentation provides details for integrating the STOMACH backend with mobile applications.

**Base URL:** `https://magdy.host/backend/api`

---

## 1. Authentication (`auth.php`)

### Register
*   **Method:** `POST`
*   **Query Param:** `?action=register`
*   **Body:**
    ```json
    {
      "name": "Full Name",
      "email": "user@example.com",
      "password": "yourpassword",
      "avatarImg": 1
    }
    ```
*   **Response:** `200 OK` with user object (includes `id` and `role`).

### Login
*   **Method:** `POST`
*   **Query Param:** `?action=login`
*   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Response:** `200 OK` with user object.

---

## 2. Medical Data (`medical_data.php`)

### Get All Medical Records
Used to fetch symptoms, organs, and conditions for the diagnostic flow.
*   **Method:** `GET`
*   **Response:**
    ```json
    {
      "organs": [...],
      "symptoms": [...],
      "conditions": [...],
      "mappings": [...]
    }
    ```

---

## 3. Appointments (`bookings.php`)

### Get User Bookings
*   **Method:** `GET`
*   **Query Param:** `?user_id={ID}`
*   **Response:** Array of booking objects including `status` and `alternativeTime`.

### Create New Booking
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "user_id": 12,
      "doctor": { "id": 1, "name": "Dr. Name", "img": 1 },
      "bookedDate": "2026-05-10",
      "bookedTime": "10:00 AM",
      "note": "Optional note"
    }
    ```

### Update Booking Status (Admin/Doctor)
*   **Method:** `POST`
*   **Query Param:** `?action=update_status`
*   **Body:**
    ```json
    {
      "booking_id": 101,
      "status": "confirmed" | "suggested",
      "alternativeTime": "New time string if suggested"
    }
    ```

---

## 4. Diagnoses (`diagnoses.php`)

### Save Diagnosis
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "user_id": 12,
      "condition_name": "ارتجاع المريء",
      "match_percentage": 85,
      "symptoms": "حموضة, ألم بالصدر"
    }
    ```

### Get User History
*   **Method:** `GET`
*   **Query Param:** `?user_id={ID}`

---

## 5. Notifications (`notifications.php`)

### Get Notifications
*   **Method:** `GET`
*   **Query Param:** `?user_id={ID}`

### Mark as Read
*   **Method:** `POST`
*   **Query Param:** `?action=mark_read`
*   **Body:** `{ "id": notification_id }`

---

## 6. AI Chatbot (`chatbot.php`)

Server-side proxy to Google Gemini. The React app calls this URL so the API key stays on the server.

### Health check
*   **Method:** `GET`
*   **URL:** `{BASE_URL}/chatbot.php`
*   **Response:** `200 OK`
    ```json
    {
      "status": "ok",
      "service": "stomach-ai-chatbot",
      "usage": "POST JSON body: { \"prompt\": \"...\", \"context\": \"...\" }"
    }
    ```

### Ask the assistant (AI reply)
*   **Method:** `POST`
*   **URL:** `{BASE_URL}/chatbot.php`
*   **Body:**
    ```json
    {
      "prompt": "What can help with mild heartburn?",
      "context": "You are STOMACH AI... (optional long system prompt in Arabic/English)"
    }
    ```
*   **Response:** `200 OK`
    ```json
    {
      "reply": "Arabic or English answer text from the model..."
    }
    ```
*   **Errors:** `400` if `prompt` is empty; `502` if Gemini fails or returns an error.

### Server configuration
*   Set environment variable **`GEMINI_API_KEY`** on the host (recommended). If unset, the server falls back to the key in `chatbot.php` (rotate keys if that file was ever public).

---

## 7. Global Headers
All requests should include:
*   `Content-Type: application/json`
*   `Accept: application/json`

> [!IMPORTANT]
> Ensure that all IDs passed are integers. For authentication, the system uses email-based role assignment (`admin@admin.com` or configured admin emails receive the `admin` role).
