// Creado por Dieg Castr
// Compinentes para mostrar la información de capsulas informativas

export const Decanatura = () => (
  <div className="p-6 bg-white rounded ">
    <h2 className="text-center text-xl font-bold mt-2 mb-10">
      REGULACIONES RELACIONADAS CON EL GOCE DE FINES DE SEMANA (SALIDAS Y
      REGRESO)
    </h2>

    <p className="mb-4">
      Los fines de semana a que un estudiante tiene derecho a salir del campus
      universitario se regulará de la siguiente manera:
    </p>

    <ol className="list-inside space-y-2">
      <li>
        <strong>15.1</strong> El estudiante que tenga promedio académico
        acumulado <u>mayor a 90%</u>, tiene derecho a todos los fines de semana
        disponibles en el trimestre.
      </li>
      <li>
        <strong>15.2</strong> El estudiante que tenga promedio académico
        acumulado entre <u>85% y 89.99%</u>, tiene derecho a 10 fines de semana
        por trimestre.
      </li>
      <li>
        <strong>15.3</strong> El estudiante que tenga promedio académico
        acumulado entre <u>80% y 84.99%</u>, tiene derecho a 8 fines de semana
        por trimestre.
      </li>
      <li>
        <strong>15.4</strong> El estudiante que tenga un promedio académico
        acumulado entre <u>75% y 79.99%</u>, tiene derecho a 4 fines de semana
        por trimestre.
      </li>
      <li>
        <strong>15.5</strong> El estudiante que tenga promedio académico
        acumulado <u>menor a 75%</u>, tiene derecho a 2 fines de semana por
        trimestre.
      </li>
      <li>
        <strong>15.6</strong> En todos los casos precedentes (Numerales
        15.1-15.5), al acumular cinco (5) faltas en un trimestre se suspenderán
        las salidas de fin de semana por un periodo de 8 semanas a partir de la
        fecha de publicación de la falta. Se contabilizarán únicamente semanas
        académicas; en caso de cambio de trimestre o año, las semanas se
        seguirán contabilizando hasta cumplir las 8 semanas.
      </li>
      <li>
        <strong>15.7</strong> El estudiante tendrá el derecho de gozar de fines
        de semana siempre y cuando no tenga una actividad oficial planificada
        para el fin de semana que solicita.
      </li>
      <li>
        <strong>15.8</strong> En caso de que tenga responsabilidades
        residenciales se le permitirá salir siempre y cuando notifique a los
        IVEs de la zona antes del viernes vía correo electrónico y coordine el
        cumplimiento de dicha responsabilidad.
      </li>
      <li>
        <strong>15.9</strong> Zamorano puede restringir las solicitudes de
        permisos si existieran razones o motivos institucionales o de seguridad.
      </li>
    </ol>
  </div>
);

export const ClaseAprenderHaciendo = () => (
  <div className="p-6 bg-white rounded">
    <h3 className="text-lg font-semibold mt-2 mb-2">Regreso de vacaciones</h3>

    <p className="mb-4">
      <strong>21.2</strong> Todo estudiante que llegue después de la fecha
      oficial de regreso de vacaciones deberá retrasar su salida de vacaciones
      del trimestre en turno el tiempo que tomó en llegar al campus de manera
      tardía. Además, es responsabilidad del estudiante pagar los días perdidos
      en Aprender Haciendo y ponerse al día en otras actividades académicas. Se
      deberá presentar justificación y avisar vía correo electrónico al Decano
      Académico sobre la ausencia.
    </p>

    <p className="mb-8">
      Toda salida que realice el estudiante implicará la reposición de las horas
      de ausencia de Aprender Haciendo y dependiendo de las circunstancias,
      también se evaluará la posible reposición de tiempo al culminar el
      trimestre antes de su salida de vacaciones.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">Servicios Médicos</h3>

    <p className="mb-4">
      <strong>26.10</strong> Si después de ser atendido, el médico extiende
      incapacidad (absoluta o relativa), debe informar vía correo electrónico a
      la DAE y al personal de Coordinación de Aprender Haciendo, quien a la vez
      es responsable de informar a profesores e instructores sobre esta
      condición y determinar si la incapacidad merece la ausencia del estudiante
      de sus actividades de Aprender Haciendo, en caso de ser relativa como se
      indica en el numeral 26.22 incisos a y b.
    </p>

    <p className="mb-4">
      <strong>26.21</strong> Cualquier ausencia a clase o al Aprender Haciendo
      (AH) por motivo de salud, deberá ser acreditada con incapacidad médica
      expedida por médico(s) debidamente colegiado(s) de la Clínica Médica en
      Zamorano o por médicos especialistas fuera del Campus. Las incapacidades
      médicas otorgadas por médicos y clínicas ajenas al Campus deberán ser
      homologadas por la Clínica Médica de Zamorano en un plazo no mayor a 24
      horas. La clínica médica de Zamorano notificará las incapacidades a la DAE
      y a la Decanatura Asociada de Gestión y Calidad Académica (DAGCA) sobre
      las facultades y posibilidades de realizar o no actividades relacionadas
      con sus responsabilidades académicas (clases y AH).
    </p>

    <p className="mb-2 font-semibold">
      26.22 Las incapacidades médicas pueden ser:
    </p>
    <ul className="list-decimal list-inside space-y-2 ml-10">
      <li>
        <strong>Incapacidad relativa A:</strong> Capacidad para atender a
        obligaciones de clases y ciertas actividades de AH según reporte médico
        y evaluadas por el Coordinador de Aprender Haciendo junto con el
        instructor del módulo del estudiante.
      </li>
      <li>
        <strong>Incapacidad relativa B:</strong> Capacidad para atender a
        obligaciones de clases e incapacidad de atender obligaciones de AH según
        reporte médico y notificado al instructor.
      </li>
      <li>
        <strong>Incapacidad absoluta:</strong> Incapacidad para atender a
        obligaciones de clases y AH según reporte médico y notificado a
        profesores e instructores.
      </li>
    </ul>
  </div>
);

export const TecnologiasInformacion = () => (
  <div className="p-6 bg-white rounded">
    <h2 className="text-xl font-bold mt-4 mb-10">
      32. SERVICIOS OFRECIDOS Y PROCEDIMIENTOS ESTABLECIDOS POR LA OFICINA DE
      TECNOLOGÍAS DE INFORMACIÓN (IT)
    </h2>

    <p className="mb-4">
      <strong>32.1</strong> IT facilita computadoras portátiles asignadas a cada
      estudiante, las cuales son propiedad de ZAMORANO y son previamente
      preparadas a fin de evitar problemas dentro de la red. Los estudiantes
      deben suscribir un contrato de comodato por el uso del equipo. La
      computadora pasará a ser propiedad del estudiante hasta que este se
      gradúe. Si el estudiante se retira antes de su graduación deberá entregar
      la computadora asignada con todos sus accesorios a IT.
    </p>

    <p className="mb-4">
      <strong>32.2</strong> Las computadoras asignadas serán configuradas por
      ZAMORANO y estas no pueden ser alteradas por los estudiantes. Esto
      incluye:
    </p>
    <ul className="list-decimal list-inside space-y-2 ml-10">
      <li>Integración al Dominio ZAMORANO</li>
      <li>Antivirus Corporativo de ZAMORANO</li>
      <li>Sistema contra SpyWare</li>
      <li>Nombre definido a la computadora</li>
      <li>
        El sistema operativo requerido y/o proveído es Windows 10 Professional o
        Windows 8 Business o Enterprise. ZAMORANO hará los cambios necesarios de
        conformidad con el acuerdo que tenga con su proveedor de software
      </li>
      <li>Configuración WiFi de la computadora</li>
    </ul>

    <p className="mt-4 mb-4">
      <strong>32.3</strong> Es responsabilidad del estudiante la instalación de
      software adicional en la computadora asignada y debe contar con la
      licencia del mismo.
    </p>

    <p className="mb-4">
      <strong>32.4</strong> Los estudiantes que posean computadoras adicionales
      a la facilitada por ZAMORANO no podrán tener acceso a la red institucional
      del campus, sin embargo, pueden acceder a la red MOBILE junto con
      tabletas, teléfonos u otros dispositivos.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">
      Revisión de Computadoras asignadas a estudiantes:
    </h3>

    <p className="mb-4">
      <strong>32.5</strong> La Unidad a la cual debe asistir para solicitar
      soporte técnico o reportar un problema con su computadora asignada por
      Zamorano es la Unidad Atención Usuarios, la cual tiene las extensiones
      telefónicas: <strong>2015</strong> y <strong>2082</strong>, y está ubicada
      a la par del Centro de Cómputo Educativo (CCE).
    </p>

    <p className="mb-4">
      <strong>32.7</strong> Se ha creado un procedimiento para la revisión de
      equipos en nuestra oficina, el cual se describe a continuación:
    </p>
    <ul className="list-decimal list-inside space-y-2 ml-10">
      <li>
        Si el estudiante requiere revisión de su equipo, deberá movilizar el
        mismo a la oficina de la Unidad de Atención a Usuarios. La Unidad deberá
        llenar la hoja de comprobante de equipo, en la cual se describen todos
        los datos necesarios para que el técnico asignado lo revise. El
        estudiante firmará la hoja de comprobante de equipo a su entrega. El
        equipo estará en revisión por un periodo no menor a 48 horas.
      </li>
      <li>
        El encargado de Atención a Usuarios entregará al usuario del equipo una
        constancia en la cual se proporcionará la siguiente información:
        <ul className="list-disc list-inside ml-6 space-y-1">
          <li># de Solicitud o Incidente</li>
          <li>Fecha y hora de ingreso</li>
          <li>Descripción del problema del equipo y otros datos</li>
          <li>Fecha y hora prometida de salida</li>
          <li>Técnico que recibe el equipo y su firma</li>
        </ul>
      </li>
    </ul>

    <p className="mt-4 mb-4">
      <strong>32.11</strong> Si usted tiene algún reclamo o considera que la
      atención a sus solicitudes no está siendo realizada a su entera
      satisfacción, favor de seguir los siguientes niveles de escalonamiento
      enviando un email a las direcciones indicadas.
    </p>
    <ul className="list-decimal list-inside space-y-2 ml-10">
      <li>
        NIVEL NARANJA: Coordinador de Atencion a Usuarios (Samuel Ortega -
        sortega@zamorano.edu) Si la persona encargada de la unidad no atiende su
        reclamo en 48 horas pase al siguiente nivel.
      </li>
      <li>
        NIVEL AMARILLO: Coordinador de Operaciones de la Oficina de Tecnologias
        de Informacion (Heber Erazo -herazo@zamorano.edu) Si la persona
        encargada de Operaciones no atiende su reclamo en 24 horas pase al
        siguiente nivel.
      </li>
      <li>
        NIVEL ROJO: Gerente de la Oficina de Tecnologias de Informacion (Diana
        Baquedano - dbaquedano@zamorano.edu)
      </li>
    </ul>
  </div>
);
