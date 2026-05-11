import * as React from 'react';

interface EmailTemplateProps {
  link: string;
}

export function EmailTemplate({ link }: EmailTemplateProps) {
  return (
    <div>
      <h1>Rcuperar Contraseña</h1>
      <p>Haz click en el botón para cambiar tu contraseña:</p>
      <a href={link}>Cambiar Contraseña</a>
    </div>
  );
}
