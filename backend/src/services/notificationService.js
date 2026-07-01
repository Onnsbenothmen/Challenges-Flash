class NotificationService {
  constructor() {
    this.enabled = process.env.EMAIL_ENABLED === 'true';
    this.transporter = null;
  }

  init() {
    if (!this.enabled) {
      console.log('Service d\\'email désactivé. Configurez EMAIL_ENABLED=true dans .env pour activer.');
      return;
    }
    try {
      const nodemailer = require('nodemailer');
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.example.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '',
        },
      });
      console.log('Service d\\'email initialisé');
    } catch (err) {
      console.error('Erreur d\\'initialisation du service email:', err.message);
      this.enabled = false;
    }
  }

  async sendQuoteNotification(quote, type = 'created') {
    if (!this.enabled || !this.transporter) {
      console.log(`[Notification] Devis ${quote.id} - ${type} (email désactivé)`);
      return { sent: false, reason: 'email_disabled' };
    }

    const subjectMap = {
      created: `Nouveau devis n°${quote.id} - ${quote.title}`,
      updated: `Devis n°${quote.id} mis à jour - ${quote.title}`,
      status: `Statut mis à jour : ${quote.status} - ${quote.title}`,
    };

    try {
      await this.transporter.sendMail({
        from: `"Portail & Inspections" <${process.env.EMAIL_FROM || 'noreply@grouperif.com'}>`,
        to: quote.email,
        subject: subjectMap[type] || subjectMap.created,
        html: this.buildEmailTemplate(quote, type),
      });
      console.log(`Email envoyé pour le devis ${quote.id}`);
      return { sent: true };
    } catch (err) {
      console.error(`Erreur d\\'envoi d\\'email pour le devis ${quote.id}:`, err.message);
      return { sent: false, reason: err.message };
    }
  }

  buildEmailTemplate(quote, type) {
    const statusLabels = { draft: 'Brouillon', sent: 'Envoyé', approved: 'Approuvé', rejected: 'Rejeté' };
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a56db; color: white; padding: 1.5rem; text-align: center;">
          <h1 style="margin: 0; font-size: 1.5rem;">Portail & Inspections</h1>
        </div>
        <div style="padding: 1.5rem; border: 1px solid #e5e7eb;">
          <h2>${type === 'created' ? 'Nouveau devis créé' : 'Mise à jour de devis'}</h2>
          <p><strong>N° Devis :</strong> DEV-${String(quote.id).padStart(4, '0')}</p>
          <p><strong>Titre :</strong> ${quote.title}</p>
          <p><strong>Statut :</strong> ${statusLabels[quote.status] || quote.status}</p>
          <p><strong>Montant :</strong> ${parseFloat(quote.total_amount).toFixed(2)} €</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0;" />
          <p style="color: #6b7280; font-size: 0.875rem;">
            Ce message est automatique, merci de ne pas y répondre.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 1rem; text-align: center; font-size: 0.75rem; color: #9ca3af;">
          RIF - 2 B Rue Alfred Nobel, 77420 Champs-sur-Marne
        </div>
      </div>
    `;
  }
}

module.exports = new NotificationService();
