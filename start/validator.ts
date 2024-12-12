import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    // Applicable for all fields
    'required': 'Le champ {{ field }} est requis',
    'string': 'La valeur du champ {{ field }} doit être du type chaîne de caractères',
    'email': 'L\'adresse email saisie n\'est pas une adresse valide',
    'date': 'La valeur du champ {{ field }} doit être de type date',
    'date.afterField': 'La valeur du champ {{ field }} doit dépasser celle du champ {{ otherField}}',
    'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
    'maxLength': 'Le champ {{ field }} doit contenir au plus {{ max }} caractères',
    'number': 'Le champ {{ field }} doit être un nombre',
    'enum': 'La valeur du champ {{ field }} sélectionnée est invalide',
    'array': 'Le champ {{ field }} doit être un tableau'
})