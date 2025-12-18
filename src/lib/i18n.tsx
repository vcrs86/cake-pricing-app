"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Language = "es" | "en";

type Copy = {
  general: {
    appTitle: string;
    tagline: string;
    mobileFriendly: string;
  };
  download: {
    label: string;
    title: string;
    description: string;
    button: string;
  };
  modes: {
    label: string;
    title: string;
    description: string;
    basic: string;
    advanced: string;
  };
  basicIntro: {
    title: string;
    body: string;
  };
  ingredientManager: {
    badge: string;
    title: string;
    helper: string;
    name: string;
    placeholder: string;
    unit: string;
    packageSize: string;
    packageCost: string;
    addButton: string;
    empty: string;
    costPerUnit: string;
    actions: string;
    delete: string;
  };
  recipeBuilder: {
    badge: string;
    title: string;
    addLine: string;
    empty: string;
    per: string;
    ingredient: string;
    quantity: string;
    lineCost: string;
    remove: string;
    total: string;
  };
  calculatorForm: {
    quickIngredients: string;
    quickIngredientsHelper: string;
    ingredientCost: string;
    quickHelp: string;
    coreDetails: string;
    cakeSize: string;
    decorationCost: string;
    decorationCostHelp: string;
    hoursWorked: string;
    hourlyRate: string;
    complexity: string;
    complexityHelp: string;
    extras: string;
    cakeTopper: string;
    sugarFlowers: string;
    freshFlowers: string;
    figures3d: string;
    extrasHint: string;
    additionalServices: string;
    setupHours: string;
    setupRate: string;
    deliveryFee: string;
    profitMargin: string;
    profitNote: string;
    submit: string;
    complexityOptions: {
      basic: string;
      intermediate: string;
      advanced: string;
      veryComplex: string;
    };
  };
  resultCard: {
    badge: string;
    title: string;
    servings: string;
    highlightLabel: string;
    highlightNote: string;
    rows: {
      ingredients: string;
      decoration: string;
      laborOnly: string;
      extrasDelivery: string;
      baseCost: string;
      profit: string;
      suggested: string;
      recommended: string;
      perServing: string;
    };
    footer: string;
  };
  recipeInfo: {
    title: string;
    items: string[];
    cta: string;
  };
  proFeatures: {
    title: string;
    preview: string;
    cards: { title: string; description: string }[];
    locked: string;
  };
  formHelper: string;
  languageToggle: {
    label: string;
  };
};

const translations: Record<Language, Copy> = {
  es: {
    general: {
      appTitle: "Calculadora de Precios para Pasteles",
      tagline:
        "Alterna entre un cálculo rápido o un desglose avanzado por ingrediente. La lógica está lista para personalizarse.",
      mobileFriendly: "Diseñada para móvil",
    },
    download: {
      label: "Descarga",
      title: "Obtén el proyecto completo en ZIP",
      description:
        "Usa este botón para descargar directamente \"cake-pricing-app.zip\". Incluye el código fuente, configuraciones y recursos para ejecutarlo localmente o desplegarlo en Vercel, sin comandos de terminal.",
      button: "⬇️ Descargar ZIP del proyecto",
    },
    modes: {
      label: "Elige tu vista",
      title: "Modo Básico o Avanzado",
      description:
        "Básico es ideal para cotizaciones rápidas con un total único de ingredientes. Avanzado habilita precios por cantidad, extras, entrega y montaje, manteniendo las funciones PRO bloqueadas.",
      basic: "Básico (sereno)",
      advanced: "Avanzado (detallado)",
    },
    basicIntro: {
      title: "Cotizaciones rápidas sin complicaciones",
      body: "El modo Básico oculta los ingredientes uno a uno. Ingresa un total único y cambia a Avanzado en cualquier momento para recetas, entrega o montaje.",
    },
    ingredientManager: {
      badge: "Lista de precios de ingredientes",
      title: "Costos base por paquete",
      helper: "Todos los ingredientes son editables. Ajusta nombre, unidad, tamaño y precio según tus compras reales.",
      name: "Nombre",
      placeholder: "Mantequilla",
      unit: "Unidad",
      packageSize: "Tamaño del paquete",
      packageCost: "Costo del paquete",
      addButton: "Agregar ingrediente",
      empty: "Agrega tu primer ingrediente para comenzar a armar recetas.",
      costPerUnit: "Costo por unidad",
      actions: "Acciones",
      delete: "Eliminar",
    },
    recipeBuilder: {
      badge: "Calculadora de receta",
      title: "Costos por cantidad para este pastel",
      addLine: "+ Agregar ingrediente",
      empty: "Añade ingredientes de tu lista e ingresa la cantidad usada en este pastel.",
      per: "por",
      ingredient: "Ingrediente",
      quantity: "Cantidad",
      lineCost: "Costo de este ingrediente",
      remove: "Quitar",
      total: "Costo total de ingredientes para esta receta",
    },
    calculatorForm: {
      quickIngredients: "Ingredientes (total rápido)",
      quickIngredientsHelper: "Ingresa un total aproximado. Cambia a Avanzado para calcular por cantidad.",
      ingredientCost: "Costo de ingredientes",
      quickHelp: "Usa el subtotal de tu lista de compras o una estimación rápida.",
      coreDetails: "Datos principales del proyecto",
      cakeSize: "Tamaño del pastel",
      decorationCost: "Materiales de decoración (no ingredientes)",
      decorationCostHelp: "Fondant, buttercream, cajas, bases y otros insumos no listados arriba.",
      hoursWorked: "Horas para hornear/decorar",
      hourlyRate: "Tarifa por hora",
      complexity: "Complejidad de decoración",
      complexityHelp: "Multiplica materiales + extras + mano de obra según el nivel de detalle.",
      extras: "Extras opcionales",
      cakeTopper: "Cake topper",
      sugarFlowers: "Flores de azúcar",
      freshFlowers: "Flores frescas",
      figures3d: "Figuras 3D",
      extrasHint: "Cambia a Avanzado para rastrear flores de azúcar y figuras 3D.",
      additionalServices: "Servicios adicionales",
      setupHours: "Horas de montaje en sitio",
      setupRate: "Tarifa de montaje",
      deliveryFee: "Entrega",
      profitMargin: "Margen de ganancia",
      profitNote: "Comúnmente 20-40% según complejidad y demanda.",
      submit: "Mostrar mi precio de pastel",
      complexityOptions: {
        basic: "Básico",
        intermediate: "Intermedio (+10%)",
        advanced: "Avanzado (+25%)",
        veryComplex: "Muy complejo (+40%)",
      },
    },
    resultCard: {
      badge: "Tu cotización",
      title: "Precio listo para compartir",
      servings: "porciones",
      highlightLabel: "Total para celebrar",
      highlightNote: "Incluye un colchón suave del 7% para ajustes de último momento.",
      rows: {
        ingredients: "Ingredientes",
        decoration: "Decoración y mano de obra",
        laborOnly: "Mano de obra",
        extrasDelivery: "Extras + entrega",
        baseCost: "Costo base",
        profit: "Ganancia",
        suggested: "Mínimo sugerido",
        recommended: "Precio recomendado",
        perServing: "Precio por porción",
      },
      footer:
        "El precio recomendado suma un 7% para cubrir ajustes, tiempos extra o pruebas. La complejidad multiplica decoración + mano de obra. Ajusta el margen cuando lo necesites: la lógica está en src/lib/pricing.ts.",
    },
    recipeInfo: {
      title: "Cómo se calculan los ingredientes",
      items: [
        "Cada ingrediente guarda tamaño y costo del paquete. El costo por unidad se calcula automáticamente.",
        "La receta multiplica el costo unitario por la cantidad que usas en este pastel.",
        "La complejidad multiplica materiales + extras + mano de obra para cubrir diseños detallados.",
      ],
      cta: "Actualiza cualquier campo y presiona Calcular precio para fijar los números.",
    },
    proFeatures: {
      title: "Funciones PRO — muy pronto",
      preview: "Vista previa. Aún no forman parte del cálculo.",
      cards: [
        {
          title: "Costo de energía del horno",
          description: "Tiempo de horneado × potencia del horno × costo por kWh."
        },
        {
          title: "Gastos operativos mensuales",
          description: "Reparte renta, servicios, marketing, internet/teléfono y contabilidad."
        },
        {
          title: "Guardar presets y reportes",
          description: "Conserva recetas frecuentes, exporta cotizaciones y revisa rentabilidad."
        },
        {
          title: "Reglas de tarifas avanzadas",
          description: "Recargos urgentes, rangos de entrega por distancia y ajustes estacionales."
        }
      ],
      locked: "Bloqueado — fuera del cálculo actual",
    },
    formHelper: "Cambia cualquier campo y presiona Calcular precio para fijar los números.",
    languageToggle: {
      label: "Idioma",
    },
  },
  en: {
    general: {
      appTitle: "Cake Pricing Calculator",
      tagline:
        "Switch between a quick quote or advanced ingredient breakdown. The pricing logic stays easy to tweak.",
      mobileFriendly: "Mobile friendly",
    },
    download: {
      label: "Download",
      title: "Grab the full project as a ZIP",
      description:
        "Use this button to download \"cake-pricing-app.zip\" directly. It includes source files, configs, and assets so you can run locally or deploy to Vercel without terminal commands.",
      button: "⬇️ Download project ZIP",
    },
    modes: {
      label: "Choose your view",
      title: "Basic or Advanced mode",
      description:
        "Basic is perfect for quick quotes with a single ingredient total. Advanced unlocks quantity-based pricing, extras, delivery, and setup while keeping PRO features locked.",
      basic: "Basic (calm)",
      advanced: "Advanced (detailed)",
    },
    basicIntro: {
      title: "Quick quotes without the fuss",
      body: "Basic mode hides ingredient-by-ingredient inputs. Enter a single total and switch to Advanced any time for recipes, delivery, or setup work.",
    },
    ingredientManager: {
      badge: "Ingredient price list",
      title: "Base costs by package",
      helper: "Every ingredient is editable. Adjust name, unit, size, and price to match your real costs.",
      name: "Name",
      placeholder: "Butter",
      unit: "Unit",
      packageSize: "Package size",
      packageCost: "Package cost",
      addButton: "Add ingredient",
      empty: "Add your first ingredient to start building recipes.",
      costPerUnit: "Cost per unit",
      actions: "Actions",
      delete: "Delete",
    },
    recipeBuilder: {
      badge: "Recipe cost calculator",
      title: "Quantity-based costs per cake",
      addLine: "+ Add ingredient",
      empty: "Add ingredients from your list and enter the quantity used for this cake.",
      per: "per",
      ingredient: "Ingredient",
      quantity: "Quantity",
      lineCost: "Cost for this ingredient",
      remove: "Remove",
      total: "Total ingredient cost for this recipe",
    },
    calculatorForm: {
      quickIngredients: "Ingredients (quick total)",
      quickIngredientsHelper: "Enter a rough total. Switch to Advanced to price by quantity.",
      ingredientCost: "Ingredient cost",
      quickHelp: "Use your latest shopping subtotal or a quick estimate.",
      coreDetails: "Core project details",
      cakeSize: "Cake size",
      decorationCost: "Decoration materials (non-ingredients)",
      decorationCostHelp: "Fondant sheets, buttercream, boxes, boards — anything not tracked above.",
      hoursWorked: "Hours for baking/decorating",
      hourlyRate: "Hourly rate",
      complexity: "Decoration complexity",
      complexityHelp: "Applies a multiplier to materials + extras + labor to reflect intricacy.",
      extras: "Optional extras",
      cakeTopper: "Cake topper",
      sugarFlowers: "Sugar flowers",
      freshFlowers: "Fresh flowers",
      figures3d: "3D figures",
      extrasHint: "Switch to Advanced for sugar flowers and 3D figures.",
      additionalServices: "Additional services",
      setupHours: "On-site setup hours",
      setupRate: "Setup hourly rate",
      deliveryFee: "Delivery fee",
      profitMargin: "Profit margin",
      profitNote: "Commonly 20-40% depending on complexity and demand.",
      submit: "Show my cake price",
      complexityOptions: {
        basic: "Basic",
        intermediate: "Intermediate (+10%)",
        advanced: "Advanced (+25%)",
        veryComplex: "Very complex (+40%)",
      },
    },
    resultCard: {
      badge: "Your quote",
      title: "Ready-to-share pricing",
      servings: "servings",
      highlightLabel: "Celebration-ready total",
      highlightNote: "Includes a gentle 7% cushion for last-minute tweaks.",
      rows: {
        ingredients: "Ingredients",
        decoration: "Decoration & labor",
        laborOnly: "Labor only",
        extrasDelivery: "Extras + delivery",
        baseCost: "Base cost",
        profit: "Profit",
        suggested: "Suggested minimum",
        recommended: "Recommended price",
        perServing: "Price per serving",
      },
      footer:
        "The recommended price adds a 7% cushion for adjustments, delivery time, or taste tests. Complexity multiplies decoration + labor. Tweak margins anytime in src/lib/pricing.ts.",
    },
    recipeInfo: {
      title: "How ingredient costs are calculated",
      items: [
        "Each ingredient stores package size and cost. Cost per unit is auto-calculated.",
        "Recipe cost multiplies the unit cost by the quantity you use for this cake.",
        "Complexity multiplies materials + extras + labor so ornate work is covered.",
      ],
      cta: "Update any field and press Calculate price to lock in the numbers.",
    },
    proFeatures: {
      title: "PRO features — coming soon",
      preview: "Preview only. These costs are not part of the calculation yet.",
      cards: [
        {
          title: "Electricity / oven energy cost",
          description: "Bake time × oven power × cost per kWh."
        },
        {
          title: "Monthly operational expenses",
          description: "Spread rent, utilities, marketing, internet/phone, and accounting across orders."
        },
        {
          title: "Save presets and reports",
          description: "Store go-to recipes, export quotes, and run profitability snapshots."
        },
        {
          title: "Advanced fee rules",
          description: "Rush fees, delivery distance bands, and seasonal surcharges."
        }
      ],
      locked: "Locked — not part of today’s calculation",
    },
    formHelper: "Update any field and press Calculate price to lock in the numbers.",
    languageToggle: {
      label: "Language",
    },
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  copy: Copy;
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
