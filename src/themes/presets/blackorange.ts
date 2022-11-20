import darkTheme from './dark'

const colorSet = Object.assign({}, darkTheme.colorSet, {
  '@primaryColor': '#FF9900',
  '@secondaryColor': '#FF9900',

  '@textColor': '#fff',
  '@secondaryTextColor': '#999',

  '@backgroundColor': '#000',
  '@dialogBackgroundColor': '#222'
})

export default {
  colorSet,
  toFavIconPath: 'dark'
}
