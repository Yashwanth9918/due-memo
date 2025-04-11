import Client from "../models/client.js";
import User from "../models/user.js";


export const addClient = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;

    //  Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

     // Check if the client already exists
     const existingClient = await Client.findOne({ email, userId: req.user.id });
     if (existingClient) {
       return res.status(400).json({ message: "Client with this email already exists" });
     }
     
    const newClient = new Client({
      name,
      phoneNumber,
      email,
      userId: req.user.id,
    });

    await newClient.save();

    // update user 
    user.clients.push(newClient._id);
    await user.save();

    res.status(201).json({ message: "Client added successfully", client: newClient });
  } catch (error) {
    console.log(error);
    console.log(req.body);
    res.status(500).json({ message: "Error adding client", error: error.message });
  }
};

export const getClient = async (req, res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    console.log(client);
    res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } 
};
