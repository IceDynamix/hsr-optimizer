import { Constants, SACERDOS_RELIVED_ORDEAL_1_STACK, SACERDOS_RELIVED_ORDEAL_2_STACK, setToId } from './constants.ts'
import { BASE_PATH } from 'lib/db.js'

// let baseUrl = process.env.PUBLIC_URL // Local testing;
// const baseUrl = 'https://d28ecrnsw8u0fj.cloudfront.net'

function getImageUrl(name) {
  return new URL(BASE_PATH + `/assets` + name, import.meta.url).href
}

let iconFromStatMapping
export const Assets = {
  getStatIcon: (stat, percented) => {
    if (!iconFromStatMapping) {
      iconFromStatMapping = {
        [Constants.Stats.HP]: 'IconMaxHP.webp',
        [Constants.Stats.ATK]: 'IconAttack.webp',
        [Constants.Stats.DEF]: 'IconDefence.webp',
        [Constants.Stats.HP_P]: 'IconMaxHP.webp',
        [Constants.Stats.ATK_P]: 'IconAttack.webp',
        [Constants.Stats.DEF_P]: 'IconDefence.webp',
        [Constants.Stats.SPD]: 'IconSpeed.webp',
        [Constants.Stats.SPD_P]: 'IconSpeed.webp',
        [Constants.Stats.CR]: 'IconCriticalChance.webp',
        [Constants.Stats.CD]: 'IconCriticalDamage.webp',
        [Constants.Stats.EHR]: 'IconStatusProbability.webp',
        [Constants.Stats.RES]: 'IconStatusResistance.webp',
        [Constants.Stats.BE]: 'IconBreakUp.webp',
        [Constants.Stats.ERR]: 'IconEnergyRecovery.webp',
        [Constants.Stats.OHB]: 'IconHealRatio.webp',
        [Constants.Stats.Physical_DMG]: 'IconPhysicalAddedRatio.webp',
        [Constants.Stats.Fire_DMG]: 'IconFireAddedRatio.webp',
        [Constants.Stats.Ice_DMG]: 'IconIceAddedRatio.webp',
        [Constants.Stats.Lightning_DMG]: 'IconThunderAddedRatio.webp',
        [Constants.Stats.Wind_DMG]: 'IconWindAddedRatio.webp',
        [Constants.Stats.Quantum_DMG]: 'IconQuantumAddedRatio.webp',
        [Constants.Stats.Imaginary_DMG]: 'IconImaginaryAddedRatio.webp',
      }
    }
    if (stat == 'CV') return getImageUrl(`/misc/cv.webp`)
    if (stat == 'simScore') return getImageUrl(`/misc/battle.webp`)
    if (stat == Constants.Stats.HP_P && percented) return getImageUrl(`/misc/IconMaxHPPercent.webp`)
    if (stat == Constants.Stats.ATK_P && percented) return getImageUrl(`/misc/IconAttackPercent.webp`)
    if (stat == Constants.Stats.DEF_P && percented) return getImageUrl(`/misc/IconDefencePercent.webp`)
    if (!stat || !iconFromStatMapping[stat]) return Assets.getBlank()

    return getImageUrl(`/icon/property/${iconFromStatMapping[stat]}`)
  },
  getCharacterPortraitById: (id) => {
    if (!id) {
      console.warn('No id found')
      return Assets.getBlank()
    }

    return getImageUrl(`/image/character_portrait/${id}.webp`)
  },
  getCharacterAvatarById: (id) => {
    if (!id) return Assets.getBlank()

    return getImageUrl(`/icon/avatar/${id}.webp`)
  },
  getCharacterPreviewById: (id) => {
    if (!id) return Assets.getBlank()

    return getImageUrl(`/image/character_preview/${id}.webp`)
  },

  getLightConePortrait: (lightCone) => {
    if (!lightCone) return Assets.getBlank()
    return getImageUrl(`/image/light_cone_portrait/${lightCone.id}.webp`)
  },
  getLightConePortraitById: (lightConeId) => {
    if (!lightConeId) return Assets.getBlank()
    return getImageUrl(`/image/light_cone_portrait/${lightConeId}.webp`)
  },
  getLightConeIconById: (lightConeId) => {
    if (!lightConeId) return Assets.getBlank()
    return getImageUrl(`/icon/light_cone/${lightConeId}.webp`)
  },
  getPath: (path) => {
    if (!path) return Assets.getBlank()
    return getImageUrl(`/icon/path/${path}.webp`)
  },
  getPathFromClass: (c) => {
    if (!c) return Assets.getBlank()
    return getImageUrl(`/icon/path/${c}.webp`)
  },

  getElement: (element) => {
    if (!element) return Assets.getBlank()
    return getImageUrl(`/icon/element/${element}.webp`)
  },
  getBlank: () => {
    return getImageUrl('/misc/blank.webp')
  },
  getQuestion: () => {
    return getImageUrl('/misc/tooltip.webp')
  },
  getLogo: () => {
    return getImageUrl('/misc/logo.webp')
  },
  getDiscord: () => {
    return getImageUrl('/misc/badgediscord.webp')
  },
  getGithub: () => {
    return getImageUrl('/misc/badgegithub.webp')
  },
  getKofi: () => {
    return getImageUrl('/misc/badgekofi.webp')
  },
  getStar: () => {
    return getImageUrl('/misc/StarBig.webp')
  },
  getGuideImage: (name) => {
    return getImageUrl(`/misc/guide/${name}.webp`)
  },
  getLocaleGuideImage: (name, locale) => {
    if (!locale) return Assets.getBlank()
    return getImageUrl(`/misc/guide/${locale}/${name}.webp`)
  },
  getStarBw: () => {
    return getImageUrl('/misc/QuestMainIcon.webp')
  },
  getFlag: (locale) => {
    return getImageUrl(`/misc/flags/${locale}.webp`)
  },

  getPart: (part) => {
    const mapping = {
      [Constants.Parts.Head]: 'partHead',
      [Constants.Parts.Hands]: 'partHands',
      [Constants.Parts.Body]: 'partBody',
      [Constants.Parts.Feet]: 'partFeet',
      [Constants.Parts.PlanarSphere]: 'partPlanarSphere',
      [Constants.Parts.LinkRope]: 'partLinkRope',
    }

    return getImageUrl(`/misc/${mapping[part]}.webp`)
  },

  getChangelog: (path) => {
    return getImageUrl(`/misc/changelog/${path}`)
  },

  getSetImage: (set, part, actualIcon = false) => {
    if (set == -1) {
      return Assets.getBlank()
    }
    if (!part) {
      part = Constants.Parts.PlanarSphere
    }

    const partToId = {
      base: '',
      [Constants.Parts.Head]: '_0',
      [Constants.Parts.Hands]: '_1',
      [Constants.Parts.Body]: '_2',
      [Constants.Parts.Feet]: '_3',
      [Constants.Parts.PlanarSphere]: '_0',
      [Constants.Parts.LinkRope]: '_1',
    }
    if (actualIcon) {
      return getImageUrl(`/icon/relic/${setToId[set]}.webp`)
    }
    if (set == SACERDOS_RELIVED_ORDEAL_1_STACK || set == SACERDOS_RELIVED_ORDEAL_2_STACK) {
      return getImageUrl(`/icon/relic/${setToId[Constants.Sets.SacerdosRelivedOrdeal]}${partToId[part]}.webp`)
    }
    return getImageUrl(`/icon/relic/${setToId[set]}${partToId[part]}.webp`)
  },
}
