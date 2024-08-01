const {ConversationModel} = require('../models/ConversationModel')
const ConversationController = {
    getConversationById: async (req, res) => {
        try {
            const id = req.params.id;
            const conversation = await ConversationModel.findById(id)
            res.status(200).json({
                message: 'Conversation fetched successfully',
                data: conversation
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    }
}
module.exports = ConversationController;