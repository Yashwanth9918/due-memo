import Client from "../models/client.js";


export const addClient = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;

    //  Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }
    // console.log("middleware - " ,req.user);
     // Check if the client already exists
     const existingClient = await Client.findOne({ phoneNumber, userId: req.user._id });
     if (existingClient) {
       return res.status(400).json({ message: "Client with this phone number already exists" });
     }

    const newClient = new Client({
      name,
      phoneNumber,
      email,
      userId: req.user.id,
    });

    await newClient.save();
    res.status(201).json({ message: "Client added successfully", client: newClient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding client", error: error.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ vendorId: req.params.vendorId });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
