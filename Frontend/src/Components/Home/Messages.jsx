import React, { useState } from 'react'
import '../Home/Messages.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Messages = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    console.log({ firstName, lastName, email, phone, message }); // Log the data

    try {
        const response = await axios.post(
            "http://localhost:4000/api/v1/message/send", // Your backend URL
            { firstName, lastName, email, phone, message },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(response); // Log the response to check the server's success message
        toast.success(response.data.message);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
    } catch (error) {
        console.error("Error sending message:", error); // Log the error to debug
        toast.error(error.response?.data?.message || "An error occurred");
    }
}

  return (
    <div className="container form-component message-form">
  <h2>Send Us A Message</h2>
  <form onSubmit={handleMessage}>
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>
    <div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
    <div>
      <textarea
        rows={7}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
    </div>
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <button type="submit">Send</button>
    </div>
  </form>
</div>
  )
}

export default Messages