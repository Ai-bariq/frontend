export type Locale = 'ar' | 'en'

export type LocaleStrings = {
  nav: {
    howItWorks: string
    features: string
    pricing: string
    privacy: string
    support: string
    startNow: string
    openMenu: string
    closeMenu: string
  }

  hero: {
    trusted: string
    heading: string
    taglinePrefix: string
    taglineSuffix: string
    tryNow: string
    searchPlaceholder: string
    note: string
    words: string[]
  }

  howItWorks: {
    title: string
    subtitle: string
    cta: string
    footerTitle: string
    footerPoints: string[]
    steps: Array<{
      title: string
      description: string
      badge: string
    }>
  }

  pricing: {
    title: string
    subtitle: string
    planTitle: string
    branchLabel: string
    averageLabel: string
    cta: string
    cancel: string
    featuresTitle: string
    features: string[]
    whatsappPrompt: string
    whatsappLabel: string
    promoText: string
    promoCode: string
    billing: { monthly: string; quarterly: string; yearly: string }
    billingBadges: { quarterly: string; yearly: string }
    unitLabels: { monthly: string; quarterly: string; yearly: string }
    currency: string
    tierBreakdown: {
      tier1: (count: number, price: number) => string
      tier2: (count: number, discount: string, price: number) => string
      tier3: (count: number, discount: string, price: number) => string
    }
    decreaseBranches: string
    increaseBranches: string
  }

  faq: {
    title: string
    subtitle: string
    contactPrefix: string
    contactEmail: string
    items: Array<{ question: string; answer: string }>
  }

  cta: {
    title: string
    description: string
    label: string
    features: string[]
    trust: Array<{ label: string }>
  }

  adaptive: {
    title: string
    subtitle: string
    cards: Array<{ title: string; description: string }>
  }

  footer: {
    description: string
    productTitle: string
    copyright: string
    links: Array<{ label: string; href: string }>
    badges: Array<{ label: string }>
  }

  login: {
    modes: {
      login: { title: string; submit: string; switchPrompt: string; switchAction: string; google: string }
      signup: { title: string; submit: string; switchPrompt: string; switchAction: string; google: string }
    }
    shared: {
      divider: string
      forgotPassword: string
      heroTitle: string
      heroBullets: string[]
      heroFooter: string
      passwordHint: string
      reviewTitle: string
      reviewName: string
      reviewText: string
      replyAuthor: string
      reviewReply: string
      live: string
      submitting: string
    }
    fields: {
      email: string
      password: string
      fullName: string
      phone: string
      emailPlaceholder: string
      namePlaceholder: string
    }
    errors: {
      emailRequired: string
      emailInvalid: string
      passwordRequired: string
      passwordMinLength: string
      fullNameRequired: string
      fullNameShort: string
      phoneRequired: string
      phoneInvalid: string
      loginFailed: string
      signupFailed: string
    }
  }

  adminSidebar: {
    title: string
    subtitle: string
    permissions: string
    toggleLabel: string
    nav: {
      home: string
      clients: string
      editedResponses: string
      deletedResponses: string
      settings: string
    }
  }

  adminHeader: {
    dashboard: string
    notifications: string
    openSidebar: string
    closeSidebar: string
  }

  clientSidebar: {
    nav: {
      dashboard: string
      reviews: string
      agents: string
      accounts: string
      billing: string
      settings: string
    }
  }

  clientHeader: {
    support: string
    logout: string
    addLocation: string
  }

  adminHome: {
    title: string
    subtitle: string
    searchPlaceholder: string
    sort: { latest: string; oldest: string; highestStars: string; lowestStars: string }
    stats: {
      responses: string
      responsesTotal: string
      avgTime: string
      avgTimeDesc: string
      businesses: string
      businessesDesc: string
    }
    table: {
      responseId: string
      reviewId: string
      clientName: string
      email: string
      stars: string
      review: string
      response: string
      reviewTime: string
      responseTime: string
      actions: string
      delete: string
      noResults: string
      starsOnly: string
      edit: string
      cancel: string
      save: string
    }
    unitMinutes: string
  }

  adminPages: {
    clients: {
      title: string
      subtitle: string
      searchPlaceholder: string
      table: {
        username: string
        email: string
        phone: string
        branches: string
        businessType: string
        subscriptionStatus: string
        plan: string
        noResults: string
        subscribed: string
        notSubscribed: string
      }
      plans: { monthly: string; quarterly: string; yearly: string }
    }
    editedResponses: {
      title: string
      subtitle: string
      searchPlaceholder: string
      sort: { latest: string; oldest: string }
      table: {
        reviewId: string
        clientName: string
        email: string
        review: string
        aiResponse: string
        editedResponse: string
        editedAt: string
        noResults: string
      }
    }
    deletedResponses: {
      title: string
      subtitle: string
      searchPlaceholder: string
      sort: { latest: string; oldest: string }
      table: {
        reviewId: string
        clientName: string
        email: string
        review: string
        deletedResponse: string
        deletedAt: string
        noResults: string
      }
    }
    settings: {
      title: string
      subtitle: string
      accountSection: string
      accountSubtitle: string
      nameLabel: string
      emailLabel: string
      saveChanges: string
      nameSaved: string
      nameEmpty: string
      passwordSection: string
      passwordSubtitle: string
      changePassword: string
      currentPassword: string
      newPassword: string
      confirmPassword: string
      updatePassword: string
      cancel: string
      passwordUpdated: string
      fillAllFields: string
      passwordMismatch: string
      passwordSameAsCurrent: string
      passwordRequirements: string
      req8chars: string
      reqUppercase: string
      reqLowercase: string
      reqNumber: string
      reqSpecial: string
      weakPassword: string
      deleteSection: string
      deleteSubtitle: string
      deleteAccount: string
      deleteConfirmPrompt: string
      deleteSuccess: string
      deleteWrongText: string
      confirmDelete: string
    }
  }

  clientPages: {
    reviews: {
      emptyTitle: string
      emptySubtitle: string
      addLocation: string
    }
    agents: {
      title: string
      subtitle: string
      emptyTitle: string
      emptySubtitle: string
      addLocation: string
      agentList: string
      agentListSubtitle: string
    }
    accounts: {
      title: string
      subtitle: string
      googleProfile: string
      active: string
      inactive: string
      locationsImported: (count: number) => string
      connected: string
      lastSync: string
      disconnect: string
    }
    billing: {
      title: string
      subtitle: string
      activeLocations: (count: number) => string
      addLocation: string
      currentPlan: string
      perPeriod: string
      nextRenewal: string
      active: string
      inactive: string
      invoices: string
      invoicesSubtitle: string
      noInvoices: string
      noInvoicesSubtitle: string
      invoiceLabel: (num: string) => string
    }
    settings: {
      title: string
      subtitle: string
      profileSection: string
      profileSubtitle: string
      nameLabel: string
      emailLabel: string
      phoneLabel: string
      googleAccount: string
      googleAccountNote: string
      manage: string
      saveChanges: string
      passwordSection: string
      passwordSubtitle: string
      newPassword: string
      newPasswordHint: string
      confirmPassword: string
      changePassword: string
      dangerZone: string
      dangerZoneSubtitle: string
      deleteAccount: string
      deleteWarning: string
      deleteNote: string
    }
  }

  features: {
    lostReviews: {
      sectionTitle: string
      sectionSubtitle: string
      cards: Array<{ id: string; title: string; description: string; highlight: string }>
    }
    smartReplies: {
      sectionTitle: string
      sectionSubtitle: string
      ctaLabel: string
      cards: Array<{ id: string; title: string; description: string }>
    }
    analytics: {
      badge: string
      sectionTitle: string
      sectionSubtitle: string
      points: Array<{ id: string; title: string; description: string }>
      dashboard: {
        title: string
        periods: [string, string, string]
        scoreLabel: string
        scoreStatus: string
        stats: Array<{ id: string; label: string }>
        chartTitle: string
      }
    }
    sentiment: {
      badge: string
      sectionTitle: string
      sectionSubtitle: string
      points: Array<{ id: string; title: string; description: string }>
      dashboard: {
        title: string
        positive: string
        neutral: string
        negative: string
        topicsTitle: string
        topics: Array<{ label: string; value: string; variant: 'positive' | 'negative' | 'neutral' | 'warning' }>
        chartTitle: string
      }
    }
    customization: {
      badge: string
      sectionTitle: string
      sectionSubtitle: string
      points: Array<{ id: string; title: string; description: string }>
      dashboard: {
        title: string
        agentName: string
        agentStatus: string
        toneLabel: string
        toneOptions: [string, string, string]
        instructionsLabel: string
        instructionsPlaceholder: string
        emojiLabel: string
        emojiValue: string
        lengthLabel: string
        lengthValue: string
        timingLabel: string
        signatureTitle: string
        signatureTeam: string
      }
    }
  }

  clientDashboard: {
    toolbar: { title: string; last30days: string; refresh: string }
    performance: { title: string; description: string }
    stats: { newReviews: string; avgRating: string; sentiment: string }
    sections: { reputation: string; complaints: string }
    charts: {
      sentimentTrend: string
      ratingOverTime: string
      reviewVolume: string
      ratingDistribution: string
      complaintTrend: string
      demographics: string
    }
    topics: {
      criticisms: string
      criticismsSubtitle: string
      positives: string
      positivesSubtitle: string
      emptySync: string
    }
    demographics: {
      title: string
      languages: string
      countries: string
      customerTypes: string
      noData: string
    }
    sentimentLabels: { positive: string; neutral: string; negative: string }
  }
}
