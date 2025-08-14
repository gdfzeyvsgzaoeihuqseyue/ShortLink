<template>
  <div class="py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">
          Contactez-nous
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Une question ? Un besoin spécifique ? Notre équipe est là pour vous aider.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Formulaire de contact -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input v-model="form.firstName" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input v-model="form.lastName" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input v-model="form.email" type="email" required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sujet
              </label>
              <select v-model="form.subject" required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                <option value="">Sélectionnez un sujet</option>
                <option value="support">Support technique</option>
                <option value="billing">Facturation</option>
                <option value="feature">Demande de fonctionnalité</option>
                <option value="partnership">Partenariat</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea v-model="form.message" required rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez votre demande en détail..."></textarea>
            </div>

            <button type="submit" :disabled="submitting"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="submitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Envoi en cours...
              </span>
              <span v-else>Envoyer le message</span>
            </button>
          </form>

          <div v-if="submitted" class="mt-6 p-4 bg-success-50 border border-success-200 rounded-xl">
            <p class="text-success-700 font-medium">✅ Message envoyé avec succès ! Nous vous répondrons dans les plus
              brefs délais.</p>
          </div>
        </div>

        <!-- Informations de contact -->
        <div class="space-y-8">
          <div class="card p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Autres moyens de nous contacter</h3>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Email</h4>
                  <p class="text-gray-600">contact@quicklink.com</p>
                  <p class="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Chat en direct</h4>
                  <p class="text-gray-600">Disponible sur le site</p>
                  <p class="text-sm text-gray-500 mt-1">Lun-Ven, 9h-18h</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Bureau</h4>
                  <p class="text-gray-600">123 Rue de la Tech<br>75001 Paris, France</p>
                  <p class="text-sm text-gray-500 mt-1">Uniquement sur rendez-vous</p>
                </div>
              </div>


              <div class="flex items-start">
                <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Suivez-nous</h4>

                  <div class="flex space-x-4">
                    <a href="#"
                      class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                      <svg class="w-5 h-5 text-gray-600 hover:text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#"
                      class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                      <svg class="w-5 h-5 text-gray-600 hover:text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </a>
                    <a href="#"
                      class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                      <svg class="w-5 h-5 text-gray-600 hover:text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Centre d'aide</h3>
            <p class="text-gray-600 mb-6">
              Consultez notre base de connaissances pour trouver des réponses rapides aux questions courantes.
            </p>
            <NuxtLink to="/help" class="btn-secondary inline-block">
              Accéder au centre d'aide
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const submitted = ref(false)

const submitForm = async () => {
  submitting.value = true

  // Simulation d'envoi de formulaire
  await new Promise(resolve => setTimeout(resolve, 2000))

  submitted.value = true
  submitting.value = false

  // Reset form
  Object.keys(form.value).forEach(key => {
    form.value[key] = ''
  })

  // Hide success message after 5 seconds
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}

useSeoMeta({
  title: 'Contact - QuickLink',
  description: 'Contactez l\'équipe QuickLink pour toutes vos questions sur notre service de raccourcissement d\'URLs.',
})
</script>