describe('MessageTemplateModal.vue spec', () => {
  it('Example Templates should exist by default', () => {
    cy.visit('http://localhost:3000');
    // Select message template
    cy.get('.cy-message-template-modal').click();
    cy.get('.cy-message-template-modal-default-template').click();
    cy.get('.v-list > :nth-child(2)').click();
    cy.get('.cy-message-template-modal-show-checkbox input[type=checkbox]').click();
    cy.get('.cy-message-template-modal-close-icon').click();

    // Write a message
    cy.get('.cy-chat-textarea').type('This is text for testing').type('{enter}');
    cy.get('.cy-chat-chat-message-sent-0').should('be.visible');
    cy.get('.cy-chat-chat-message-received-1').should('be.visible');
  });
});
