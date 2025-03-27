import Client from "../models/client.js";

export const addClient = async (req, res) => {
  const { vendorId, name, phone, email } = req.body;

  try {
    const client = new Client({ vendorId, name, phone, email });
    await client.save();
    res.status(201).json({ msg: "Client added successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
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
