declare namespace App {
  interface Locals {
    runtime: {
      env: {
        RESEND_API_KEY: string;
        RESEND_FROM_EMAIL?: string;
        CONTACT_EMAIL?: string;
      };
    };
  }
}
