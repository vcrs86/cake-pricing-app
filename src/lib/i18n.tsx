"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Language = "es" | "en";

const translations: Record<Language, any> = {
  es: {
    general: {
      appTitle: "Calcula el precio profesional de tu pastel",
      tagline: "Una herramienta de cálculo pensada para decoradoras que trabajan con costos reales.",
      mobileFriendly: "Optimizada para móvil",
    },
    client: {
  quoteTitle: "Presupuesto de pastel",
  servingsLabel: "porciones",
  totalLabel: "Total",
  deliveryLabel: "Delivery",
  quickMessages: "Mensajes rápidos:",
      quickMessagePresets: [
  "Para reservar la fecha del pastel debe abonarse el 50%.",
  "Pagos vía Zelle, CashApp o efectivo.",
  "El pedido debe confirmarse con al menos 72 horas de anticipación.",
  "No se realizan devoluciones una vez confirmado el pedido.",
],
  
  proBadge: "Disponible en PRO",
  freeBadge: "FREE",

  clientMessageLabel: "Mensaje para el cliente",
  clientMessageLocked: "Edición disponible en versión PRO",

  cakePhotoLabel: "Foto del pastel (opcional)",
      cakePhotoAlt: "Foto del pastel",
  printButton: "Descargar / Imprimir presupuesto",
  openPdfButton: "Abrir vista PDF",

  quickMessagesTitle: "Mensajes rápidos",
  customMessageLabel: "Mensaje personalizado (PRO)",
  devTogglePro: "(DEV) Alternar PRO",

  legalNote1:
    "Para reservar la fecha se requiere un abono del 50%. Los precios pueden variar según cambios en el diseño final, ingredientes o servicios adicionales.",

  legalNote2:
    "Esta cotización es válida por 7 días y no constituye un contrato hasta confirmación por escrito.",
},
  
    download: {
      label: "Descarga",
      title: "Obtén el proyecto completo en ZIP",
      description:
        "Descarga el proyecto completo con código y configuraciones para usarlo localmente o en Vercel.",
      button: "Descargar ZIP",
    },
    modes: {
      label: "Modo",
      title: "Selecciona el modo de cálculo",
      description: "Elige un cálculo rápido o uno detallado por ingrediente.",
      basic: "Básico",
      advanced: "Avanzado",
    },
    basicIntro: {
      title: "Cálculo simplificado",
      body: "Usa un total general o cambia a Avanzado para un desglose completo.",
    },
    ingredientManager: {
      badge: "Ingredientes",
      title: "Costos base",
      helper: "Los ingredientes son editables y deben reflejar tus costos reales.",
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
    recipeBuilder: {
      badge: "Receta",
      title: "Costo por receta",
      addLine: "Agregar ingrediente",
      empty: "Agrega ingredientes y cantidades.",
      per: "por",
      ingredient: "Ingrediente",
      quantity: "Cantidad",
      lineCost: "Costo",
      remove: "Quitar",
      total: "Total de ingredientes",
    },
    calculatorForm: {
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
        profit: "Ganancia",
        suggested: "Sugerido",
        recommended: "Recomendado",
        perServing: "Por porción",
      },
      footer: "Ajusta los valores según tu criterio profesional.",
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
    proFeatures: {
      title: "Funciones PRO",
      preview: "No incluidas aún en el cálculo.",
      cards: [
        {
          title: "Costo eléctrico",
          description: "Costo estimado del uso del horno.",
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
          description: "Recargos y ajustes especiales.",
        },
      ],
      locked: "Bloqueado",
    },
    formHelper: "Actualiza los campos y calcula el precio.",
    languageToggle: {
      label: "Idioma",
    },
    clientMessages: {
  preset1: "Para reservar la fecha del pastel debe abonarse el 50%.",
  preset2: "Pagos vía Zelle, CashApp o efectivo.",
  preset3: "El pedido debe confirmarse con al menos 72 horas de anticipación.",
  preset4: "No se realizan devoluciones una vez confirmado el pedido.",
  quickLabel: "Mensajes rápidos:",
  customLabel: "Mensaje personalizado (PRO)",
  proOnly: "Disponible en PRO",
  proEditOnly: "Edición disponible en versión PRO",
  devToggle: "(DEV) Alternar PRO",
},
brand: {
  title: "Mi marca",
  description: "Personaliza cómo se verá tu marca en las cotizaciones.",
  businessName: "Nombre del negocio",
  logo: "Logo",
  logoEmpty: "Logo no configurado",
},
  },

  en: {
    general: {
      appTitle: "Professional cake pricing",
      tagline: "A pricing tool built for decorators who work with real costs.",
      mobileFriendly: "Mobile optimized",
    },
    client: {
  quoteTitle: "Cake quote",
  servingsLabel: "servings",
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
  clientMessageLocked: "Editing available in PRO version",

  cakePhotoLabel: "Cake photo (optional)",
      cakePhotoAlt: "Cake photo",

  printButton: "Download / Print quote",
  openPdfButton: "Open PDF view",

  quickMessagesTitle: "Quick messages",
  customMessageLabel: "Custom message (PRO)",
  devTogglePro: "(DEV) Toggle PRO",

  legalNote1:
    "A 50% deposit is required to reserve the date. Prices may vary depending on final design changes, ingredients, or additional services.",

  legalNote2:
    "This quote is valid for 7 days and does not constitute a contract until confirmed in writing.",
},
        
    download: {
      label: "Download",
      title: "Get the full project ZIP",
      description: "Download the complete project with code and configs.",
      button: "Download ZIP",
    },
    modes: {
      label: "Mode",
      title: "Select pricing mode",
      description: "Choose a quick or detailed calculation.",
      basic: "Basic",
      advanced: "Advanced",
    },
    basicIntro: {
      title: "Simplified calculation",
      body: "Use a total or switch to Advanced for details.",
    },
    ingredientManager: {
      badge: "Ingredients",
      title: "Base costs",
      helper: "Ingredients are editable and should reflect your real costs.",
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
        profit: "Profit",
        suggested: "Suggested",
        recommended: "Recommended",
        perServing: "Per serving",
      },
      footer: "Adjust values as needed.",
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
    proFeatures: {
      title: "PRO features",
      preview: "Not included yet.",
      cards: [
        {
          title: "Energy cost",
          description: "Estimated oven usage cost.",
        },
        {
          title: "Operating expenses",
          description: "Rent, utilities, marketing.",
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
    },
    formHelper: "Update fields and calculate.",
    languageToggle: {
      label: "Language",
    },
    clientMessages: {
  preset1: "To reserve the cake date, a 50% deposit is required.",
  preset2: "Payments via Zelle, CashApp, or cash.",
  preset3: "Orders must be confirmed at least 72 hours in advance.",
  preset4: "No refunds once the order is confirmed.",
  quickLabel: "Quick messages:",
  customLabel: "Custom message (PRO)",
  proOnly: "Available in PRO",
  proEditOnly: "Editing available in PRO version",
  devToggle: "(DEV) Toggle PRO",
},
brand: {
  title: "My brand",
  description: "Customize how your brand appears in quotes.",
  businessName: "Business name",
  logo: "Logo",
  logoEmpty: "Logo not configured",
},
  },
};
type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  copy: any;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      copy: translations[language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
