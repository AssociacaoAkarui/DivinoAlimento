const _ = require("lodash");

// A "blacklist" padrão de campos reservados que nunca devem vir do cliente.
const DEFAULT_RESERVED_FIELDS = ["id", "createdAt", "updatedAt"];

function sanitizePayload(payload, options = {}) {
  let fieldsToOmit = [...DEFAULT_RESERVED_FIELDS];

  // Se a opção 'allow' for fornecida, remove campos da blacklist padrão.
  // Ex: permitir 'createdAt' em um script de importação de dados.
  if (options.allow && Array.isArray(options.allow)) {
    fieldsToOmit = _.difference(fieldsToOmit, options.allow);
  }

  // Se a opção 'additionalOmit' for fornecida, adiciona mais campos à blacklist.
  // Ex: não permitir que o usuário defina o campo 'status' na criação.
  if (options.additionalOmit && Array.isArray(options.additionalOmit)) {
    fieldsToOmit = [...fieldsToOmit, ...options.additionalOmit];
  }

  return _.omit(payload, fieldsToOmit);
}

module.exports = {
  sanitizePayload,

  normalizePayload(model, payload) {
    const attributes = model.getAttributes();

    for (const key in payload) {
      if (payload.hasOwnProperty(key) && attributes[key]) {
        const attributeType = attributes[key].type;

        // Verifica se o campo é do tipo Data e se o valor é uma string vazia
        if (
          ["DATE", "DATEONLY"].includes(attributeType.key) &&
          payload[key] === ""
        ) {
          payload[key] = null;
        }
      }
    }

    return payload;
  },
};
