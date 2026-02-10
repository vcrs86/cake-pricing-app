"use client";

export const translations = {
  es: {
    general: {
  appTitle: "Calcula el precio profesional de tu pastel",

  tagline: "Una herramienta de cálculo pensada para decoradores que trabajan con costos reales.",

  mobileFriendly: "Optimizado para móvil",

  badge: "Herramienta profesional de precios",

  trustNote: "Usado por reposteras independientes",
},
    tabs: {
      calculator: "Calculadora",
      recipes: "Recetas",
      client: "Cliente",
      brand: "Marca",
      pro: "PRO",
      help: "Guía",
    },
    calculatorForm:{
      quickIngredients: "Ingredientes (total)",
      quickIngredientsHelper: "Usa un total rápido o cambia a Avanzado.",
      ingredientCost: "Costo de ingredientes",
      quickHelp: "Estimación rápida.",
      coreDetails: "Detalles",
      cakeSize: "Tamaño del pastel",
      decorationCost: "Decoración",
      decorationCostHelp: "Fondant, cajas, bases, etc.",
      hoursWorked: "Horas de trabajo",
      hourlyRate: "Tarifa por hora",
      complexity: "Complejidad",
      complexityHelp: "Nivel de detalle del diseño.",
      extras: "Extras",
      cakeTopper: "Cake topper",
      sugarFlowers: "Flores de azúcar",
      freshFlowers: "Flores frescas",
      figures3d: "Figuras 3D",
      extrasHint: "Opcional",
      additionalServices: "Servicios adicionales",
      setupHours: "Horas de montaje",
      setupRate: "Tarifa de montaje",
      deliveryFee: "Entrega",
      profitMargin: "Margen de ganancia",
      profitNote: "Porcentaje aplicado al costo total.",
      submit: "Calcular precio",
    complexityOptions: {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  veryComplex: "Muy complejo",
},
    },
    resultCard: {
  badge: "Resultado",
      title: "Precio calculado",
      servings: "porciones",
      highlightLabel: "Precio recomendado",
      highlightNote: "Calculado según costos, tiempo y margen.",
      rows: {
        ingredients: "Ingredientes",
        decoration: "Decoración",
        laborOnly: "Mano de obra",
        extrasDelivery: "Extras y entrega",
        baseCost: "Costo base",
        additionalCost: "Costos operativos (energía, renta, utilities)",
        profit: "Ganancia",
        suggested: "Sugerido",
        recommended: "Recomendado",
        perServing: "Por porción",
        perServingNote: "Valor estimado por porción según el precio final",
      },
      footer: "Ajusta los valores según tu criterio profesional.",
      // --- 🔥 NUEVAS --- //
      extrasNote:
        "Extras y delivery se trasladan al cliente y no generan ganancia.",
      operationalNote: "Costos operativos del negocio. No generan ganancia.",
      suggestedNote:
        "El precio sugerido se cálcula a partir de tus costos reales y el margen de ganancia definido",
        recommendedNote:
  "El precio recomendado es el valor final que se presenta al cliente, ajustado por redondeo o estrategia comercial",
  profitHint: "Este precio está pensado para que ganes, no solo para vender.",
},
recipeInfo: {
      title: "Cálculo de ingredientes",
      items: [
        "Cada ingrediente tiene un costo por unidad.",
        "La receta calcula según la cantidad usada.",
        "La complejidad ajusta el total.",
      ],
      cta: "Actualiza y recalcula cuando quieras.",
    },
ingredientManager: {
  badge: "Ingredientes",
  title: "Costos base",
  helper:
    "Edita los ingredientes según tus costos reales.",
  name: "Nombre",
  placeholder: "Mantequilla",
  unit: "Unidad",
  packageSize: "Tamaño del paquete",
  packageCost: "Costo del paquete",
  addButton: "Agregar ingrediente",
  empty: "Agrega ingredientes para comenzar.",
  costPerUnit: "Costo por unidad",
  actions: "Acciones",
  delete: "Eliminar",
},

recipes: {
  saveTitle: "Guardar receta",
  saveDescription:
    "Guarda esta receta para reutilizarla en futuros pedidos.",
  temporaryNote:
    "En FREE, las recetas solo se guardan durante esta sesión.",
  recipeName: "Nombre de la receta",
  recipePlaceholder: "Ej: Chocolate – 20 porciones",
  unnamed: "Receta sin nombre",
  saveButton: "Guardar receta",
  savedListTitle: "Recetas guardadas",
  empty: "Aún no tienes recetas guardadas.",
  use: "Usar",
  edit: "Editar",
  delete: "Eliminar",
  confirmDelete: "¿Seguro que deseas eliminar esta receta?",
  proLocked:
    "Guardar recetas está disponible solo en PRO.",
  searchPlaceholder: "Buscar receta...",
  noResults: "No se encontraron recetas",
  helpLabel: "Ayuda con recetas",
},
recipeBuilder: {
  badge: "Receta",
  title: "Costo de la receta",
  addLine: "Agregar ingrediente",
  empty: "Agrega ingredientes y cantidades.",
  per: "por",
  ingredient: "Ingrediente",
  quantity: "Cantidad",
  lineCost: "Costo",
  remove: "Eliminar",
  total: "Total de ingredientes",
},
brand: {
  title: "Mi marca",

  description: "Personaliza cómo aparece tu marca en las cotizaciones.",

  businessName: "Nombre del negocio",

  businessNamePlaceholder: "Ej: Tu Marca",

  logo: "Logo",

  logoEmpty: "Logo no configurado",

  proOnlyNote: "Disponible en la versión PRO",
},
quotes: {
  title: "Presupuestos guardados",
      use: "Usar",
      edit: "Editar",
      delete: "Eliminar",
      date: "Fecha",
      empty: "Aún no has guardado presupuestos.",
      saveTitle: "Guardar presupuesto",
      saveDescription: " Guarda este cálculo completo para reutilizarlo, editarlo o enviarlo nuevamente a tus clientes",
      saveButton: " Guardar presupuesto",
      listTitle: "Presupuestos guardados",
      useQuote: "Usar",
      editQuote: "Editar",
      deleteQuote: "Eliminar",
      confirmDelete: "¿Deseas eliminar este presupuesto?",
      proLocked: "Guarda presupuestos para reutilizarlos, editarlos y no volver a cotizar desde cero. Disponible en PRO",
      ProLockedList: "Accede a tus presupuestos guardados y reutilízalos cuando lo necesites con PRO",
},

proFeatures: {
  title: "Funciones PRO",

  preview: "Aún no incluidas.",

  cards: [
    {
      title: "Costo de energía",
      description: "Uso estimado del horno y equipos.",
    },
    {
      title: "Gastos operativos",
      description: "Renta, servicios y marketing.",
    },
    {
      title: "Presets y reportes",
      description: "Guardar y exportar cotizaciones.",
    },
    {
      title: "Reglas avanzadas",
      description: "Cargos urgentes y recargos.",
    },
  ],

  locked: "Bloqueado",
  formHelper: "Actualiza los campos y calcula el precio.",
},
    client: {
  quoteTitle: "Presupuesto de pastel",
  servingsLabel: "Porciones",
  totalLabel: "Total",
  deliveryLabel: "Delivery",
  quickMessages: "Mesajes rápidos",

  quickMessagePresets: [
    "Se requiere un depósito del 50% para reservar la fecha.",
    "Pagos por Zelle, CashApp o efectivo.",
    "Los pedidos deben confirmarse con al menos 72 horas.",
    "No hay reembolsos una vez confirmado el pedido.",
  ],

  proBadge: "Disponible en PRO",
  freeBadge: "FREE",

  clientMessageLabel: "Mensaje para el cliente",
  clientMessageLocked:
    "Puedes usar mensajes predeterminados. Mensajes personalizados solo en PRO",
  proEditActive: "Mensaje editable (PRO activo)",

  cakePhotoLabel: "Foto del pastel (opcional)",
  cakePhotoAlt: "Foto del pastel",

  printButton: "Descargar / Imprimir cotización",
  openPdfButton: "Abrir vista PDF",
  quickMessagesTitle: "Mensajes rápidos",
  customMessageLabel: "Mensaje personalizado (PRO)",

  legalNote1:
    "Para reservar la fecha se requiere un abono del 50%. Los precios pueden variar según cambios en el diseño final, ingredientes o servicios adicionales.",

  legalNote2:
    "Esta cotización es válida por 7 días y no constituye un contrato hasta confirmación por escrito.",

  uploadButton: "Subir imagen",
  noFileSelected: "Ningún archivo seleccionado",
  fileSelected: "Archivo seleccionado",
},
    success: {
  title: "¡CakePrice Pro está activo!",
  subtitle: "Bienvenida a la versión profesional 🎉",
  description:
    "Tu pago se procesó correctamente y ahora tienes acceso completo a todas las funciones PRO de CakePrice.",

  featuresTitle: "¿Qué puedes hacer ahora?",
  features: [
    "Incluir costos operativos reales (energía, renta, marketing)",
    "Guardar y reutilizar recetas",
    "Crear presupuestos más precisos y profesionales",
    "Personalizar tu marca para mostrarla a tus clientes",
  ],

  backButton: "Ir a la app",
  note:
    "El acceso PRO se guarda en este navegador. Si borras los datos del navegador, el acceso se perderá.",
    supportText: "¿Tienes alguna duda o sugerencia? Escríbenos a",

  // 🔒 Compatibilidad con el success viejo (por si acaso)
  message: "Gracias por tu compra. Tu versión PRO está activa.",
  redirecting: "Redirigiendo a la aplicación…",
  footer:
    "Gracias por apoyar el desarrollo de CakePrice 💕",
},

languageToggle: {
  label: "Idioma",
},
modes: {
  label: "Modo de cálculo",
  title: "Elige cómo quieres calcular",
  description:
    "Selecciona entre una estimación rápida o un cálculo detallado según el pedido.",

  basic: "Básico",
  advanced: "Avanzado",

  basicTitle: "Cálculo simplificado",
  basicDescription:
    "Este modo utiliza un costo general estimado para ingredientes y extras. Es ideal para presupuestos rápidos, pedidos sencillos o cuando no necesitas un desglose detallado.",

  advancedTitle: "Cálculo avanzado",
  advancedDescription:
    "Este modo permite un cálculo más preciso incluyendo ingredientes detallados, tiempo de trabajo, complejidad del diseño, extras y servicios adicionales. Recomendado para pedidos personalizados o de mayor valor.",
},
currency: {
  label: "Moneda",

  options: {
    usd: "USD – Estados Unidos",
    eur: "EUR – Euro",
    mxn: "MXN – México",
    cop: "COP – Colombia",
    ars: "ARS – Argentina",
  },
},
    pro: {
  title: "CakePrice PRO",
  subtitle: "Herramientas avanzadas para hacer crecer tu negocio",
tieredAdvancedOnly: {
  title: "Disponible solo en modo avanzado",
  description:
    "Para usar pasteles de varios niveles, activa primero el modo avanzado."
},

  // ================= FEATURES =================
  features: {
    tieredCake: {
  title: "Pasteles por niveles",
  description: "Calcula automáticamente tortas de varios pisos",
},

    saveRecipes: {
      title: "Guardar recetas",
      description: "Guarda y reutiliza tus recetas",
    },

    saveQuotes: {
      title: "Guardar presupuestos",
      description: "Organiza y reutiliza cotizaciones",
    },

    brandCustomization: {
      title: "Personalización de marca",
      description: "Agrega tu logo y nombre comercial",
    },

    operationalCosts: {
      title: "Costos operativos",
      description: "Incluye energía, renta, servicios y marketing",
    },

    proSupport: {
      title: "Soporte PRO",
      description: "Soporte prioritario y actualizaciones futuras",
    },
  },

  // ================= INTRO =================
  intro: {
    title: "Versión PRO",

    description:
      "Diseñada para decoradores que quieren controlar sus costos reales y hacer crecer su negocio.",

    highlight: "Todo lo que necesitas para cobrar profesionalmente",

    note: "Pago único · Sin suscripción",

    features: {
      energy: "Cálculo de gasto de energía",
      rent: "Renta y utilities",
      marketing: "Costos de marketing",
      cloud: "Guardado local seguro",
    },

    includesLabel: "Incluye:",

    includesText: "guardado automático · pago único · sin login",

    extras: {
      saveRecipes: "Guarda tus recetas y presupuestos",
      accessQuotes: "Accede a tus cálculos guardados",
      brandCustomization: "Personaliza con tu marca",
    },
  },

  // ================= TOGGLE =================
  toggle: {
    title: "Funciones disponibles al activar PRO",
    active: "PRO ACTIVADO ✅",
    inactive: "Activar PRO",

    note:
      "Próximamente: planes avanzados con reportes y reglas personalizadas.",
  },

  // ================= STATUS =================
  active: "PRO activo",
  free: "Versión FREE",
  locked: "Función exclusiva PRO",
  cta: "Desbloquear PRO",

  // ================= OPERATIONAL COSTS =================
  operationalCosts: {
    title: "Costos operativos",

    description:
      "Configura energía, renta, servicios y marketing para precios más precisos.",

    lockedDescription: "Costos operativos avanzados (PRO)",
  },

  includeCosts: {
    title: "Incluir costos operativos",

    description:
      "Energía, renta, utilities y marketing se sumarán al precio final.",
  },

  // ================= ENERGY =================
  energy: {
    title: "Costo de energía (horno)",

    ovenKwh: "kWh del horno",
    ovenHours: "Horas de uso",
    energyRate: "Costo por kWh ($)",

    result: "Costo estimado de energía",

    energyHelp:
      "kWh mide el consumo eléctrico. Un horno de 3000W usado 1 hora consume 3 kWh.",
  },

  // ================= RENT =================
  rent: {
    title: "Costo de renta",

    monthlyRent: "Renta mensual ($)",
    workDays: "Días trabajados al mes",
    daysUsed: "Días usados para este pedido",

    result: "Costo de renta por pedido",

    helper:
      "Si trabajas desde casa, usa solo un porcentaje (10%–30%).",
  },

  // ================= UTILITIES =================
  utilities: {
    title: "Costo de utilities",

    monthlyUtilities: "Utilities mensuales ($)",
    workDays: "Días trabajados al mes",
    daysUsed: "Días usados",

    result: "Costo por pedido",
  },

  // ================= MARKETING =================
  marketing: {
    title: "Costo de marketing",

    monthlyMarketing: "Marketing mensual ($)",
    ordersPerMonth: "Pedidos al mes",

    result: "Marketing por pedido",
  },

  // ================= SUPPORT =================
  support: {
    text: "¿Tienes dudas o sugerencias?",
    emailLabel: "Escríbenos a",
  },

  // ================= CAKE LEVELS =================
  cakeLevels: {
    title: "Niveles del pastel",

    helper:
      "Configura cada nivel del pastel. Cada nivel se calcula por separado.",

    numberOfTiers: "Número de niveles",
    tier: "Nivel",

    flavor: "Sabor",

    shape: "Forma",
    shapeRound: "Redondo",
    shapeSquare: "Cuadrado",
    shapeRectangular: "Rectangular",

    size: "Tamaño",

    diameter: "Diámetro",
    sideLength: "Lado",
    width: "Ancho",
    height: "Alto",

    unitInches: "pulg",

    servingsLabel: "Porciones",

    complexity: "Complejidad",

    tieredSummary: "Pastel por niveles",

    totalPrice: "Precio total",

    locked:
      "Los pasteles por niveles están disponibles solo en PRO",
  },
  funnel: {
  oneCakePays: "💰 Un solo pastel bien cobrado paga tu licencia",
  unlockButton: "🔓 Desbloquear PRO",
},
operationalHelp: {
  rent: {
    title: "Costo de renta (si trabajas desde casa)",
    description:
      "Si trabajas desde casa, NO debes colocar la renta completa de tu hogar. Solo incluye la parte que realmente usas para tu negocio.",
    bullets: [
      "Ejemplo: si usas una habitación como cocina o taller.",
      "Puedes calcular un porcentaje aproximado del espacio (10–30%).",
      "Si no tienes un espacio dedicado, puedes dejar este campo en 0.",
    ],
  },

  utilities: {
    title: "Servicios (agua, luz, gas, internet)",
    description:
      "Aquí se agrupan los servicios básicos relacionados con tu trabajo como repostera.",
    bullets: [
      "Incluye solo una parte proporcional de tus servicios del hogar.",
      "No es necesario dividir cada servicio por separado.",
      "Si trabajas desde casa, puedes estimar un porcentaje razonable (10–25%).",
    ],
  },

  energy: {
    title: "Costo de energía (horno)",
    description:
      "Este cálculo sirve para estimar cuánto gastas en electricidad al usar tu horno.",
    bullets: [
      "Revisa en tu horno el consumo en kWh (normalmente en la etiqueta).",
      "Multiplica las horas reales que usas el horno por pedido.",
      "No uses el total de tu factura eléctrica completa.",
      "Si no sabes el dato exacto, puedes estimar un promedio.",
    ],
  },

  marketing: {
    title: "Costo de marketing",
    description:
      "Aquí se incluye el dinero que inviertes para conseguir clientes.",
    bullets: [
      "Incluye anuncios en redes sociales, flyers o promociones.",
      "No es obligatorio usar este campo si no haces publicidad pagada.",
      "Si promocionas solo algunos pedidos, divide el gasto entre ellos.",
      "Si no inviertes en publicidad, puedes dejarlo en 0.",
    ],
  },
},
},
    landing: {
  hero: {
    title: "Calcula el precio profesional de tus pasteles",
    subtitle: "Cobra con seguridad. Sin improvisar. Sin perder dinero.",
    description:
      "CakePrice te ayuda a calcular precios reales considerando ingredientes, tiempo, complejidad y ganancia.",
    cta: "Desbloquear CakePrice PRO",
  },

  problem: {
    title: "¿Te identificas con esto?",
    items: [
      "Trabajas mucho pero sientes que ganas poco",
      "No sabes si realmente estás cubriendo tus costos",
      "Cada presupuesto lo haces desde cero",
    ],
    conclusion:
      "CakePrice existe para que cobres como profesional, no por intuición.",
  },

  solution: {
    title: "La solución",
    description: "CakePrice calcula por ti:",
    items: [
      "Costos reales de ingredientes",
      "Tiempo de trabajo",
      "Complejidad del diseño",
      "Margen de ganancia claro",
      "Precio final listo para el cliente",
    ],
  },

  comparison: {
    title: "FREE vs PRO",

    free: {
      title: "FREE",
      features: [
        "Calcular precios",
        "Vista para el cliente",
      ],
    },

    pro: {
      title: "PRO",
      features: [
        "Guardar recetas",
        "Guardar presupuestos",
        "Reutilizar cotizaciones",
        "Costos operativos (energía, renta, utilities)",
        "Personalizar con tu marca y logo",
      ],
    },
  },
},
help: {
  guide: {
    title: "Guía de uso",
    subtitle:
      "Un manual claro para evitar confusiones entre FREE y PRO.",
    note:
      "Tip: verás etiquetas 🆓 / ✅ / 🔒 PRO para saber qué está disponible.",
  },
  recipe: {
    title: "Cómo usar recetas",

    step1Title: "1️⃣ Usa una receta base",
    step1Text:
      "Tu receta debe ser para un solo pastel (ej: 6” u 8”). No producción masiva.",

    step2Title: "2️⃣ Crea recetas por sabor",
    step2Text:
      "Cada sabor debe tener su propia receta. Por ejemplo: vainilla, chocolate, zanahoria, red velvet.",

    step3Title: "3️⃣ Agrega ingredientes reales",
    step3Text:
      "Incluye solo lo que realmente usas: harina, huevos, mantequilla, cacao, zanahoria, frutas, etc.",

    step4Title: "4️⃣ Ingresa cantidades reales",
    step4Text:
      "Usa exactamente las cantidades que utilizas en tu cocina.",

    step5Title: "5️⃣ Cómo lo usa CakePrice",
    step5Text:
      "La app calcula el costo por porción y lo adapta automáticamente según el tamaño y los niveles del pastel.",

    warning:
      "No agregues recetas para varios pasteles ni producción en masa.",

    close: "Entendido",
  },
},
  },

  en: {
    general: {
  appTitle: "CakePrice",

  tagline: "A pricing tool built for decorators who work with real costs.",

  mobileFriendly: "Mobile optimized",

  badge: "Professional pricing tool",

  trustNote: "Trusted by independent cake decorators",
},

    tabs: {
      calculator: "Calculator",
      recipes: "Recipes",
      client: "Client",
      brand: "Brand",
      pro: "PRO",
      help: "Guide",
    },

    calculatorForm: {
      quickIngredients: "Ingredients (total)",
      quickIngredientsHelper: "Quick estimate or Advanced mode.",
      ingredientCost: "Ingredient cost",
      quickHelp: "Quick estimate.",
      coreDetails: "Details",
      cakeSize: "Cake size",
      decorationCost: "Decoration",
      decorationCostHelp: "Fondant, boxes, boards, etc.",
      hoursWorked: "Labor hours",
      hourlyRate: "Hourly rate",
      complexity: "Complexity",
      complexityHelp: "Design detail level.",
      extras: "Extras",
      cakeTopper: "Cake topper",
      sugarFlowers: "Sugar flowers",
      freshFlowers: "Fresh flowers",
      figures3d: "3D figures",
      extrasHint: "Optional",
      additionalServices: "Additional services",
      setupHours: "Setup hours",
      setupRate: "Setup rate",
      deliveryFee: "Delivery",
      profitMargin: "Profit margin",
      profitNote: "Applied over total cost.",
      submit: "Calculate price",
      complexityOptions: {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
  veryComplex: "Very complex",
},
    },
resultCard: {
  badge: "Result",
      title: "Calculated price",
      servings: "servings",
      highlightLabel: "Recommended price",
      highlightNote: "Calculated from costs, labor and margin.",
      rows: {
        ingredients: "Ingredients",
        decoration: "Decoration",
        laborOnly: "Labor",
        extrasDelivery: "Extras & delivery",
        baseCost: "Base cost",
        additionalCost: "Operational costs (energy, rent, utilities)",
        profit: "Profit",
        suggested: "Suggested",
        recommended: "Recommended",
        perServing: "Per serving",
        perServingNote: "Estimated price per serving based on the final amount.",
      },
      footer: "Adjust values as needed.",
      // --- 🔥 NEW --- //
      extrasNote:
        "Extras and delivery are passed through to the client and do not generate profit.",
      operationalNote: "Business operational costs. No profit is applied.",
      suggestedNote:
        "The suggested price reflects the real cost plus the defined profit.",
        recommendedNote:
  "The recommended price may differ slightly from the suggested price due to rounding or pricing strategy.",
  profitHint: "This price is designed for profit, not just for selling.",
},
recipeInfo: {
      title: "Ingredient calculation",
      items: [
        "Each ingredient has a unit cost.",
        "Recipe multiplies by quantity.",
        "Complexity adjusts the total.",
      ],
      cta: "Update and recalculate anytime.",
    },

ingredientManager: {
  badge: "Ingredients",

  title: "Base costs",

  helper:
    "Edit ingredients to match your real costs.",

  name: "Name",

  placeholder: "Butter",

  unit: "Unit",

  packageSize: "Package size",

  packageCost: "Package cost",

  addButton: "Add ingredient",

  empty: "Add ingredients to start.",

  costPerUnit: "Cost per unit",

  actions: "Actions",

  delete: "Delete",
},

recipes: {
  saveTitle: "Save recipe",

  saveDescription:
    "Save this recipe to reuse it for future orders.",

  temporaryNote:
    "On FREE, recipes are stored only for this session.",

  recipeName: "Recipe name",

  recipePlaceholder: "e.g. Chocolate – 20 servings",

  unnamed: "Untitled recipe",

  saveButton: "Save recipe",

  savedListTitle: "Saved recipes",

  empty: "You don’t have any saved recipes yet.",

  use: "Use",
  edit: "Edit",
  delete: "Delete",

  confirmDelete: "Are you sure you want to delete this recipe?",

  proLocked:
    "Saving recipes is available in PRO only.",

  searchPlaceholder: "Search recipe...",

  noResults: "No recipes found",
  helpLabel: "Recipe help",
},
recipeBuilder: {
  badge: "Recipe",

  title: "Recipe cost",

  addLine: "Add ingredient",

  empty: "Add ingredients and quantities.",

  per: "per",

  ingredient: "Ingredient",

  quantity: "Quantity",

  lineCost: "Cost",

  remove: "Remove",

  total: "Total ingredients",
},
brand: {
  title: "My brand",

  description: "Customize how your brand appears in quotes.",

  businessName: "Business name",

  businessNamePlaceholder: "e.g. Your Brand",

  logo: "Logo",

  logoEmpty: "Logo not configured",

  proOnlyNote: "Available in PRO version",
},
quotes: {
  title: "Saved quotes",

  saveTitle: "Save quote",

  saveDescription:
    "Save this calculation to reuse or edit it later",

  saveButton: "Save quote",

  listTitle: "Saved quotes",

  use: "Use",
  edit: "Edit",
  delete: "Delete",

  date: "Date",

  empty: "You don’t have any saved quotes yet.",

  confirmDelete: "Delete this quote?",

  proLocked:
    "Save quotes and reuse them anytime. Available in PRO only",
},

proFeatures: {
  title: "PRO features",

  preview: "Not included yet.",

  cards: [
    {
      title: "Energy cost",
      description: "Estimated oven and equipment usage.",
    },
    {
      title: "Operating expenses",
      description: "Rent, utilities, and marketing.",
    },
    {
      title: "Presets & reports",
      description: "Save and export quotes.",
    },
    {
      title: "Advanced rules",
      description: "Rush fees and surcharges.",
    },
  ],

  locked: "Locked",
  formHelper: "Update fields and calculate.",
},

    client: {
  quoteTitle: "Cake quote",
   servingsLabel: "Servings",
  totalLabel: "Total",
  deliveryLabel: "Delivery",

  quickMessages: "Quick messages:",
  quickMessagePresets: [
    "A 50% deposit is required to reserve the cake date.",
    "Payments via Zelle, CashApp, or cash.",
    "Orders must be confirmed at least 72 hours in advance.",
    "No refunds once the order is confirmed.",
  ],

  proBadge: "Available in PRO",
  freeBadge: "FREE",

  clientMessageLabel: "Message for the client",
  clientMessageLocked:
    "You can use preset messages. Custom messages are available in PRO",
  proEditActive: "Editable message (PRO active)",

  cakePhotoLabel: "Cake photo (optional)",
  cakePhotoAlt: "Cake photo",

  printButton: "Download / Print quote",
  openPdfButton: "Open PDF view",

  quickMessagesTitle: "Quick messages",
  customMessageLabel: "Custom message (PRO)",

  legalNote1:
    "A 50% deposit is required to reserve the date. Prices may vary depending on final design changes, ingredients, or additional services.",

  legalNote2:
    "This quote is valid for 7 days and does not constitute a contract until confirmed in writing.",

  uploadButton: "Upload image",
  noFileSelected: "No file selected",
  fileSelected: "File selected",
},
success: {
  title: "CakePrice Pro is now active!",
  subtitle: "Welcome to the professional version 🎉",

  description:
    "Your payment was successful and you now have full access to all CakePrice Pro features.",

  featuresTitle: "What can you do now?",
  features: [
    "Include real operational costs (energy, rent, marketing)",
    "Save and reuse recipes",
    "Create more accurate, professional quotes",
    "Customize your brand for client-facing views",
  ],

  backButton: "Go to the app",

  note:
    "Pro access is saved in this browser. Clearing browser data will remove access.",

  supportText: "Questions or feedback? Email us at",

  // 🔒 Backward compatibility
  message: "Thank you for your purchase. Your PRO version is active.",
  redirecting: "Redirecting to the app…",

  footer: "Thank you for supporting CakePrice development 💕",
},

languageToggle: {
  label: "Language",
},
modes: {
  label: "Calculation mode",
  title: "Choose how you want to calculate",
  description:
    "Select between a quick estimate or a detailed calculation depending on the order.",

  basic: "Basic",
  advanced: "Advanced",

  basicTitle: "Simplified calculation",
  basicDescription:
    "This mode uses a general estimated cost for ingredients and extras. It’s ideal for quick quotes, simple orders, or when a detailed breakdown is not needed.",

  advancedTitle: "Advanced calculation",
  advancedDescription:
    "This mode provides a more accurate calculation by including detailed ingredients, working time, design complexity, extras, and additional services. Recommended for custom or higher-value orders.",
},
currency: {
  label: "Currency",

  options: {
    usd: "USD – United States",
    eur: "EUR – Euro",
    mxn: "MXN – Mexico",
    cop: "COP – Colombia",
    ars: "ARS – Argentina",
  },
},
    pro: {
      
  title: "CakePrice PRO",
  subtitle: "Advanced tools to grow your cake business",

  tieredAdvancedOnly: {
  title: "Available in Advanced mode only",
  description:
    "To use tiered cakes, please switch to Advanced mode first."
},

  // ================= FEATURES =================
  features: {
    tieredCake: {
  title: "Tiered Cakes",
  description: "Calculate multi-tier cakes automatically",
},
    saveRecipes: {
      title: "Save Recipes",
      description: "Save and reuse your recipes anytime",
    },

    saveQuotes: {
      title: "Save Quotes",
      description: "Organize and reuse client quotes",
    },

    brandCustomization: {
      title: "Brand Customization",
      description: "Add your logo and business name",
    },

    operationalCosts: {
      title: "Operational Costs",
      description: "Include energy, rent, utilities, and marketing",
    },

    proSupport: {
      title: "PRO Support",
      description: "Priority support and future updates",
    },
  },

  // ================= INTRO =================
  intro: {
    title: "PRO Version",

    description:
      "Designed for cake decorators who want to control their real costs and grow their business.",

    highlight: "Everything you need to price professionally",

    note: "One-time payment · No subscriptions",

    features: {
      energy: "Energy cost calculation",
      rent: "Rent and utilities",
      marketing: "Marketing expenses",
      cloud: "Secure local storage",
    },

    includesLabel: "Includes:",

    includesText: "auto save · one-time payment · no login",

    extras: {
      saveRecipes: "Save your recipes and quotes",
      accessQuotes: "Access saved calculations anytime",
      brandCustomization: "Customize with your brand",
    },
  },

  // ================= TOGGLE =================
  toggle: {
    title: "Features available when PRO is activated",
    active: "PRO ACTIVATED ✅",
    inactive: "Activate PRO",

    note:
      "Coming soon: advanced plans with reports and custom rules.",
  },

  // ================= STATUS =================
  active: "PRO active",
  free: "FREE version",
  locked: "PRO-only feature",
  cta: "Unlock PRO",

  // ================= OPERATIONAL COSTS =================
  operationalCosts: {
    title: "Operational costs",

    description:
      "Configure energy, rent, utilities, and marketing for more accurate pricing.",

    lockedDescription: "Advanced operational costs (PRO only)",
  },

  includeCosts: {
    title: "Include operational costs",

    description:
      "Energy, rent, utilities, and marketing will be added to the final price.",
  },

  // ================= ENERGY =================
  energy: {
    title: "Energy cost (oven)",

    ovenKwh: "Oven kWh",
    ovenHours: "Hours of use",
    energyRate: "Cost per kWh ($)",

    result: "Estimated energy cost",

    energyHelp:
      "kWh measures electricity usage. A 3000W oven used for 1 hour consumes 3 kWh.",
  },

  // ================= RENT =================
  rent: {
    title: "Rent cost",

    monthlyRent: "Monthly rent ($)",
    workDays: "Working days per month",
    daysUsed: "Days used for this order",

    result: "Rent cost per order",

    helper:
      "If you work from home, use only a percentage (10%–30%).",
  },

  // ================= UTILITIES =================
  utilities: {
    title: "Utilities cost",

    monthlyUtilities: "Monthly utilities ($)",
    workDays: "Working days per month",
    daysUsed: "Days used",

    result: "Cost per order",
  },

  // ================= MARKETING =================
  marketing: {
    title: "Marketing cost",

    monthlyMarketing: "Monthly marketing ($)",
    ordersPerMonth: "Orders per month",

    result: "Marketing per order",
  },

  // ================= SUPPORT =================
  support: {
    text: "Questions or feedback?",
    emailLabel: "Contact us at",
  },

  // ================= CAKE LEVELS =================
  cakeLevels: {
    title: "Cake tiers",

    helper:
      "Configure each cake tier. Each tier is calculated separately.",

    numberOfTiers: "Number of tiers",
    tier: "Tier",

    flavor: "Flavor",

    shape: "Shape",
    shapeRound: "Round",
    shapeSquare: "Square",
    shapeRectangular: "Rectangular",

    size: "Size",

    diameter: "Diameter",
    sideLength: "Side length",
    width: "Width",
    height: "Height",

    unitInches: "in",

    servingsLabel: "Servings",

    complexity: "Complexity",

    tieredSummary: "Tiered cake",

    totalPrice: "Total price",

    locked:
      "Tiered cakes are available in PRO only",
  },
  funnel: {
  oneCakePays: "💰 One well-priced cake pays for your license",
  unlockButton: "🔓 Unlock PRO",
},
operationalHelp: {
  rent: {
    title: "Rent cost (home-based business)",
    description:
      "If you work from home, do NOT enter your full home rent. Only include the portion actually used for your business.",
    bullets: [
      "Example: if you use one room as your kitchen or workspace.",
      "You can estimate a reasonable percentage (10–30%).",
      "If you don't have a dedicated space, you can leave this as 0.",
    ],
  },

  utilities: {
    title: "Utilities (water, electricity, gas, internet)",
    description:
      "This field groups your basic services related to your baking work.",
    bullets: [
      "Only include a proportional part of your home utilities.",
      "You don’t need to split each service individually.",
      "If you work from home, estimate a reasonable percentage (10–25%).",
    ],
  },

  energy: {
    title: "Energy cost (oven usage)",
    description:
      "This calculation helps you estimate how much electricity you spend using your oven.",
    bullets: [
      "Check your oven’s power consumption in kWh (usually on the label).",
      "Multiply the real hours you use the oven per order.",
      "Do not use your full electricity bill amount.",
      "If you don’t know the exact data, you can use an estimated average.",
    ],
  },

  marketing: {
    title: "Marketing cost",
    description:
      "This section includes the money you invest to get new customers.",
    bullets: [
      "Include social media ads, flyers, or paid promotions.",
      "This field is optional if you don’t run paid advertising.",
      "If you promote only some orders, divide the cost between them.",
      "If you don’t invest in marketing, you can leave this at 0.",
    ],
  },
},
},
    landing: {
  hero: {
    title: "Calculate professional cake pricing",
    subtitle: "Charge with confidence. No guesswork. No losing money.",
    description:
      "CakePrice helps you calculate real prices based on ingredients, time, complexity, and profit.",
    cta: "Unlock CakePrice PRO",
  },

  problem: {
    title: "Does this sound familiar?",
    items: [
      "You work a lot but feel like you earn too little",
      "You're not sure if you're covering your real costs",
      "You rebuild every quote from scratch",
    ],
    conclusion:
      "CakePrice exists so you can price like a professional, not by intuition.",
  },

  solution: {
    title: "The solution",
    description: "CakePrice calculates for you:",
    items: [
      "Real ingredient costs",
      "Working time",
      "Design complexity",
      "Clear profit margin",
      "Client-ready final price",
    ],
  },

  comparison: {
    title: "FREE vs PRO",

    free: {
      title: "FREE",
      features: [
        "Price calculation",
        "Client view",
      ],
    },

    pro: {
      title: "PRO",
      features: [
        "Save recipes",
        "Save quotes",
        "Reuse calculations",
        "Operational costs (energy, rent, utilities)",
        "Brand & logo customization",
      ],
    },
  },
},
help: {
  guide: {
    title: "Guide",
    subtitle:
      "A clear guide to avoid confusion between FREE and PRO.",
    note:
      "Tip: you’ll see 🆓 / ✅ / 🔒 PRO labels to know what’s available.",
  },
  recipe: {
    title: "How to use recipes",

    step1Title: "1️⃣ Use one base recipe",
    step1Text:
      "Your recipe must be for one single cake (ex: 6” or 8”). Not bulk baking.",

    step2Title: "2️⃣ Create recipes per flavor",
    step2Text:
      "Each flavor should have its own recipe: vanilla, chocolate, carrot cake, red velvet.",

    step3Title: "3️⃣ Add real ingredients",
    step3Text:
      "Include only what you really use: flour, eggs, butter, cocoa, carrots, fruits, etc.",

    step4Title: "4️⃣ Enter real quantities",
    step4Text:
      "Use the exact amounts you use in your kitchen.",

    step5Title: "5️⃣ How CakePrice uses it",
    step5Text:
      "The app calculates cost per serving and automatically adjusts by size and tiers.",

    warning:
      "Do not add recipes for multiple cakes or mass production.",

    close: "Got it",
  },
},
  },
};
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";


type Language = "es" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  copy: any;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cakeprice-language");
    if (saved === "es" || saved === "en") return saved;
  }
  return "en";
});
useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cakeprice-language", language);
  }
}, [language]);


  const value: LanguageContextValue = {
    language,
    setLanguage,
    copy: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
