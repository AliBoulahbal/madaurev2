// server/controllers/supportController.js

// NOTE: En production, un modèle 'Ticket' ou 'SupportMessage' serait nécessaire
// pour stocker ces données dans MongoDB.

// @desc    Soumettre un nouveau ticket de support
// @route   POST /api/support/ticket
// @access  Private
exports.submitTicket = async (req, res) => {
    const { subject, details } = req.body;
    
    if (!subject || !details) {
        return res.status(400).json({ message: "Le sujet et les détails du ticket sont requis." });
    }

    try {
        // --- LOGIQUE DE SIMULATION ---
        // Simule l'enregistrement du ticket et l'envoi d'une notification à l'admin.
        const ticketId = Math.floor(Math.random() * 90000000) + 10000000;
        
        console.log(`[SUPPORT TICKET] New ticket submitted by User ID: ${req.user._id}`);
        console.log(`Subject: ${subject}, Details: ${details}`);

        // Le Front-end attend le statut 200 OK pour afficher le message de succès.
        res.status(200).json({ 
            message: `Ticket soumis avec succès. Référence: #${ticketId}`,
            ticketId
        });

    } catch (error) {
        console.error("Ticket Submission Error:", error);
        res.status(500).json({ message: "Échec de la soumission du ticket en raison d'une erreur serveur." });
    }
};