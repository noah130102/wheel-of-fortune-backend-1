const { fileUploadController } = require("../../controllers");
const {Joi} = require('./../../utils/joiUtils')

module.exports = [
  {
    method: "POST",
    path: "/fileUpload",
    joiSchemaForSwagger: {
      group: "File Upload",
      description: "Route for uploading the file.",
      model: "",
      headers:{
        authorization: Joi.string()
      },
      formData: {
        file: {
          file: 1,
        },
      },
    },
    handler: fileUploadController.fileUpload,
  },
];
