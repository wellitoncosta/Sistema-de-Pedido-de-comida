import emailjs from '@emailjs/browser';

export class EmailService {

  async enviarCodigo(
    email: string,
    codigo: string
  ) {

    try {

      const response = await emailjs.send(

        'service_x0chfyo',
        'template_u64wsgm',

        {
          to_email: email,
          codigo: codigo
        },

        '0Jfoa9ehr1rrlYFeT'
      );

      return response;

    } catch(error) {

      console.log(error);

      throw error;
    }
  }
}