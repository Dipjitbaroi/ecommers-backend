import Subscription from '../model/subscription.model.js'

export const subscription=async(req,res)=>{
    try {
        const { email } = req.params;
  
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        // Check if the email is valid
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format." });
        }
  
        // Create a new subscription object
        const subscription = new Subscription({
          email
        });
  
        // Save the subscription to the database
        await subscription.save();
  
        res.status(200).json({ message: "Email saved successfully." });
      } catch (error) {
        console.error("Error saving email:", error);
        res.status(500).json({ message: "Failed to save email." });
      }
}

export const getSubscribed=async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
        res.status(200).json({success:true, status:200, subscriptions: subscriptions})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error})  
        
    }
}