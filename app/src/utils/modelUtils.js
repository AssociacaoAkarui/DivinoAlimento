function filterPayload(model, payload, allowedFields) {
  const modelAttributes = Object.keys(model.getAttributes());

  const invalidFields = allowedFields.filter(
    (field) => !modelAttributes.includes(field),
  );

  if (invalidFields.length > 0) {
    console.warn(
      `[modelUtils] The following fields are not part of the model's attributes: ${invalidFields.join(
        ", ",
      )}`,
    );
  }

  const validAllowedFields = allowedFields.filter((field) =>
    modelAttributes.includes(field),
  );

  const filteredPayload = {};
  for (const key of validAllowedFields) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      filteredPayload[key] = payload[key];
    }
  }

  return filteredPayload;
}

module.exports = {
  filterPayload,

  normalizePayload(model, payload) {
    const attributes = model.getAttributes();

    for (const key in payload) {
      if (
        Object.prototype.hasOwnProperty.call(payload, key) &&
        attributes[key]
      ) {
        const attributeType = attributes[key].type;

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
