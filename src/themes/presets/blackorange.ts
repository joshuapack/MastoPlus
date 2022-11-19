import darkTheme from './dark'

const colorSet = Object.assign({}, darkTheme.colorSet, {
  '@primaryColor': '#FF9900',
  '@secondaryColor': '#FF9900',

  '@textColor': '#fff',
  '@secondaryTextColor': '#666',

  '@backgroundColor': '#000',
  '@dialogBackgroundColor': '#1b1b1b'
})

export default {
  colorSet,
  toFavIconPath: 'dark'
}
