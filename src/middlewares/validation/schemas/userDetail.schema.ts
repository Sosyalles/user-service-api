import Joi from 'joi';

const urlSchema = Joi.string().uri().allow(null, '');

export const userDetailSchemas = {
  updateUserDetail: Joi.object({
    bio: Joi.string().max(500),
    location: Joi.string().max(100),
    profilePhoto: Joi.string().uri(),
    profilePhotos: Joi.array().items(Joi.string().uri()),
    socialLinks: Joi.object({
      instagramUrl: urlSchema,
      twitterUrl: urlSchema,
      linkedInUrl: urlSchema,
      facebookUrl: urlSchema
    }),
    interests: Joi.array().items(Joi.string())
  }),

  updateSocialLinks: Joi.object({
    instagramUrl: Joi.string().uri().allow(null, ''),
    twitterUrl: Joi.string().uri().allow(null, ''),
    linkedInUrl: Joi.string().uri().allow(null, ''),
    facebookUrl: Joi.string().uri().allow(null, '')
  }),

  updateInterests: Joi.object({
    interests: Joi.array().items(Joi.string()).required()
  })
}; 