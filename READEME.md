# AI Meeting Assistant (IBM Watson + Node.js)

An intelligent assistant that listens to live meetings, filters key action items (tasks, deadlines), saves them to IBM Cloudant, and generates a voice summary.

## How to Run
1. **Clone the project:** `git clone [your-link]`
2. **Add Credentials:** Create a `.env` file with your IBM Cloud keys.
3. **Run with Docker:**
   
```bash
   docker build -t meeting-assistant .
   docker run --device /dev/snd meeting-assistant