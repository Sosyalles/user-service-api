import Joi from 'joi';

const urlSchema = Joi.string().uri().messages({
  'string.uri': 'Geçerli bir URL adresi giriniz',
  'string.empty': 'URL alanı boş bırakılamaz'
});

export const userDetailSchemas = {
  updateUserDetail: Joi.object({
    bio: Joi.string()
      .max(500)
      .messages({
        'string.max': 'Biyografi 500 karakteri aşamaz'
      }),
    location: Joi.string()
      .max(100)
      .messages({
        'string.max': 'Konum 100 karakteri aşamaz'
      }),
    profilePhoto: urlSchema,
    profilePhotos: Joi.array()
      .items(urlSchema)
      .max(5)
      .messages({
        'array.max': 'En fazla 5 profil fotoğrafı yüklenebilir'
      }),
    socialLinks: Joi.object({
      instagramUrl: urlSchema,
      twitterUrl: urlSchema,
      linkedInUrl: urlSchema,
      facebookUrl: urlSchema
    }),
    interests: Joi.array()
      .items(Joi.string().max(50))
      .max(10)
      .messages({
        'array.max': 'En fazla 10 ilgi alanı eklenebilir',
        'string.max': 'Her ilgi alanı 50 karakteri aşamaz'
      }),
    notificationPreferences: Joi.object({
      emailNotifications: Joi.boolean(),
      pushNotifications: Joi.boolean(),
      weeklyRecommendations: Joi.boolean()
    })
  }),

  updateSocialLinks: Joi.object({
    instagramUrl: urlSchema,
    twitterUrl: urlSchema,
    linkedInUrl: urlSchema,
    facebookUrl: urlSchema
  }),

  updateInterests: Joi.object({
    interests: Joi.array()
      .items(Joi.string().max(50))
      .max(10)
      .required()
      .messages({
        'array.max': 'En fazla 10 ilgi alanı eklenebilir',
        'string.max': 'Her ilgi alanı 50 karakteri aşamaz',
        'any.required': 'İlgi alanları gereklidir'
      })
  })
}; 