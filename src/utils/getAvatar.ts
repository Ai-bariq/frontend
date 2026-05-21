export const getAvatar = (avatar?: string | null) => {
  return avatar && avatar.trim() !== '' ? avatar : null
}