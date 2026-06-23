/* ================================================================
   CONFIGURACIÓN — Lucero González
   ================================================================
   Edita ESTOS dos valores y los 3 botones de WhatsApp de la página
   se actualizan automáticamente. No necesitas tocar el HTML.
   ================================================================ */

const WHATSAPP_CONFIG = {
  // Tu número con código de país, SIN signos +, espacios ni guiones.
  numero: "5491127012643",

  // Mensaje que se precarga cuando alguien hace clic.
  mensaje: "Hola Lucero, vi tu landing page y quiero que hablemos sobre una campaña publicitaria para mi empresa."
};

const EMAIL_CONFIG = {
  // Tu correo profesional de DonWeb.
  destinatario: "lucerogonzalez@tumundoads.com",

  // Asunto y cuerpo que se precargan al abrir la app de correo.
  asunto: "Quiero información sobre campañas publicitarias",
  mensaje: "Hola Lucero, vi tu landing page y quiero más información sobre tus planes de pauta digital."
};

/* ================================================================
   No es necesario editar nada debajo de esta línea.
   ================================================================ */

function construirLinkWhatsapp(config) {
  const mensajeCodificado = encodeURIComponent(config.mensaje);
  return `https://wa.me/${config.numero}?text=${mensajeCodificado}`;
}

function construirLinkEmail(config) {
  const asuntoCodificado = encodeURIComponent(config.asunto);
  const mensajeCodificado = encodeURIComponent(config.mensaje);
  return `mailto:${config.destinatario}?subject=${asuntoCodificado}&body=${mensajeCodificado}`;
}

function inicializarBotonesWhatsapp() {
  const link = construirLinkWhatsapp(WHATSAPP_CONFIG);
  const botones = document.querySelectorAll(
    "#navWhatsapp, #heroWhatsapp, #ctaFinalWhatsapp"
  );

  botones.forEach((boton) => {
    boton.setAttribute("href", link);
    boton.setAttribute("target", "_blank");
    boton.setAttribute("rel", "noopener noreferrer");
  });
}

function inicializarBotonEmail() {
  const link = construirLinkEmail(EMAIL_CONFIG);
  const boton = document.getElementById("ctaFinalEmail");
  if (boton) {
    boton.setAttribute("href", link);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarBotonesWhatsapp();
  inicializarBotonEmail();
});

/* ================================================================
   PLANES Y MÉTODOS DE PAGO
   ================================================================
   Cada plan tiene sus links de pago. Si un método no aplica para
   un plan (ej. Lemon todavía no está configurado), simplemente no
   se muestra ese botón en el selector.
   ================================================================ */

const PLANES = {
  meta: {
    nombre: "Plan Meta Ads — USD 700",
    hotmart: "https://pay.hotmart.com/G106408664U",
    mercadopago: "https://mpago.la/2RPms99",
    binance: true,
    pagomovil: true
  },
  google: {
    nombre: "Plan Google Ads — USD 700",
    hotmart: "https://pay.hotmart.com/X106408724S",
    mercadopago: "https://mpago.la/2RPms99",
    binance: true,
    pagomovil: true
  },
  tiktok: {
    nombre: "Plan TikTok Ads — USD 700",
    hotmart: "https://pay.hotmart.com/F106408819I",
    mercadopago: "https://mpago.la/2RPms99",
    binance: true,
    pagomovil: true
  },
  business: {
    nombre: "Plan Business — USD 1.200",
    hotmart: "https://pay.hotmart.com/V106408905N",
    mercadopago: "https://mpago.la/1vF2mq8",
    binance: true,
    pagomovil: true
  },
  landing: {
    nombre: "Landing Page Profesional — USD 500",
    hotmart: "https://pay.hotmart.com/O106458744A",
    mercadopago: "https://mpago.la/1BuPGg3",
    binance: true,
    pagomovil: true
  }
};

// Datos fijos de Pago Móvil (Venezuela) — mismos para los 4 planes
const PAGO_MOVIL_DATOS = {
  telefono: "04140158938",
  banco: "Banco Mi Banco (Bancamiga)",
  cedula: "21132655"
};

// Dato fijo de Binance Pay — mismo para los 4 planes
const BINANCE_DATOS = {
  correo: "Lucerovgg17@gmail.com"
};

// Datos visuales de cada método de pago (logo simple en texto + color)
const METODOS_PAGO = [
  { key: "hotmart", label: "Hotmart", desc: "Tarjeta de crédito/débito, cuotas", icon: "💳" },
  { key: "mercadopago", label: "Mercado Pago", desc: "Pago directo desde tu cuenta", icon: "🅼" },
  { key: "pagomovil", label: "Pago Móvil", desc: "Ver datos para transferir", icon: "📱" },
  { key: "binance", label: "Binance Pay (Cripto / USDT)", desc: "Ver datos para transferir", icon: "🟡" }
];

function abrirPago(planKey) {
  const plan = PLANES[planKey];
  if (!plan) return;

  document.getElementById("payModalPlanName").textContent = plan.nombre;
  mostrarOpciones(plan);

  document.getElementById("payModal").classList.add("pay-modal--open");
  document.body.style.overflow = "hidden";
}

function mostrarOpciones(plan) {
  const optionsContainer = document.getElementById("payModalOptions");
  optionsContainer.innerHTML = "";

  METODOS_PAGO.forEach((metodo) => {
    const valor = plan[metodo.key];
    const disponible = Boolean(valor);

    // Pago Móvil y Binance no son links: abren una vista de datos copiables dentro del mismo modal
    const esVistaDeDatos = metodo.key === "pagomovil" || metodo.key === "binance";

    const boton = document.createElement(disponible && !esVistaDeDatos ? "a" : "div");
    boton.className = "pay-option" + (disponible ? "" : " pay-option--disabled");

    if (disponible && !esVistaDeDatos) {
      boton.setAttribute("href", valor);
      boton.setAttribute("target", "_blank");
      boton.setAttribute("rel", "noopener noreferrer");
    }

    if (disponible && metodo.key === "pagomovil") {
      boton.style.cursor = "pointer";
      boton.addEventListener("click", () => mostrarDatosPagoMovil(plan));
    }

    if (disponible && metodo.key === "binance") {
      boton.style.cursor = "pointer";
      boton.addEventListener("click", () => mostrarDatosBinance(plan));
    }

    boton.innerHTML = `
      <span class="pay-option__icon">${metodo.icon}</span>
      <span class="pay-option__text">
        <span class="pay-option__label">${metodo.label}</span>
        <span class="pay-option__desc">${disponible ? metodo.desc : "Próximamente disponible"}</span>
      </span>
    `;

    optionsContainer.appendChild(boton);
  });
}

function mostrarDatosPagoMovil(plan) {
  const optionsContainer = document.getElementById("payModalOptions");

  optionsContainer.innerHTML = `
    <button class="pay-back" id="payBackBtn">← Volver a métodos de pago</button>
    <div class="pago-movil-datos">
      <div class="pago-movil-dato">
        <span class="pago-movil-dato__label">Teléfono</span>
        <span class="pago-movil-dato__valor">${PAGO_MOVIL_DATOS.telefono}</span>
        <button class="pago-movil-copy" data-copy="${PAGO_MOVIL_DATOS.telefono}">Copiar</button>
      </div>
      <div class="pago-movil-dato">
        <span class="pago-movil-dato__label">Banco</span>
        <span class="pago-movil-dato__valor">${PAGO_MOVIL_DATOS.banco}</span>
        <button class="pago-movil-copy" data-copy="${PAGO_MOVIL_DATOS.banco}">Copiar</button>
      </div>
      <div class="pago-movil-dato">
        <span class="pago-movil-dato__label">Cédula / RIF</span>
        <span class="pago-movil-dato__valor">${PAGO_MOVIL_DATOS.cedula}</span>
        <button class="pago-movil-copy" data-copy="${PAGO_MOVIL_DATOS.cedula}">Copiar</button>
      </div>
      <p class="pago-movil-nota">Una vez realizada la transferencia por el monto de tu plan, envianos el comprobante por WhatsApp para confirmar tu compra.</p>
      <a href="#" id="payMovilWhatsapp" class="btn btn--wsp" style="width:100%; justify-content:center; margin-top:0.5rem;">Enviar comprobante por WhatsApp</a>
    </div>
  `;

  document.getElementById("payBackBtn").addEventListener("click", () => mostrarOpciones(plan));

  optionsContainer.querySelectorAll(".pago-movil-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      const original = btn.textContent;
      btn.textContent = "¡Copiado!";
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });

  const linkWsp = construirLinkWhatsapp({
    numero: WHATSAPP_CONFIG.numero,
    mensaje: `Hola Lucero, ya realicé la transferencia por Pago Móvil para el ${plan.nombre}. Te envío el comprobante.`
  });
  document.getElementById("payMovilWhatsapp").setAttribute("href", linkWsp);
  document.getElementById("payMovilWhatsapp").setAttribute("target", "_blank");
}

function mostrarDatosBinance(plan) {
  const optionsContainer = document.getElementById("payModalOptions");

  optionsContainer.innerHTML = `
    <button class="pay-back" id="payBackBtnBinance">← Volver a métodos de pago</button>
    <div class="pago-movil-datos">
      <div class="pago-movil-dato">
        <span class="pago-movil-dato__label">Correo Binance</span>
        <span class="pago-movil-dato__valor">${BINANCE_DATOS.correo}</span>
        <button class="pago-movil-copy" data-copy="${BINANCE_DATOS.correo}">Copiar</button>
      </div>
      <p class="pago-movil-nota">Buscá este correo dentro de Binance Pay en tu app y transferí el monto del plan en USDT. Una vez hecho, envianos el comprobante por WhatsApp para confirmar tu compra.</p>
      <a href="#" id="payBinanceWhatsapp" class="btn btn--wsp" style="width:100%; justify-content:center; margin-top:0.5rem;">Enviar comprobante por WhatsApp</a>
    </div>
  `;

  document.getElementById("payBackBtnBinance").addEventListener("click", () => mostrarOpciones(plan));

  optionsContainer.querySelectorAll(".pago-movil-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      const original = btn.textContent;
      btn.textContent = "¡Copiado!";
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });

  const linkWsp = construirLinkWhatsapp({
    numero: WHATSAPP_CONFIG.numero,
    mensaje: `Hola Lucero, ya realicé el pago por Binance Pay para el ${plan.nombre}. Te envío el comprobante.`
  });
  document.getElementById("payBinanceWhatsapp").setAttribute("href", linkWsp);
  document.getElementById("payBinanceWhatsapp").setAttribute("target", "_blank");
}

function cerrarPago() {
  document.getElementById("payModal").classList.remove("pay-modal--open");
  document.body.style.overflow = "";
}
