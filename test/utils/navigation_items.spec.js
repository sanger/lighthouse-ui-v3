describe('navigation_items', () => {
  describe('#selectNavItems', () => {
    it('returns empty list of nav items when no items named', () => {
      const actual = selectNavItems('')
      expect(actual).toEqual([])
    })
    it('returns full list of nav items when all items named', () => {
      const allNavItemKeys = Object.keys(allNavigationItems)
      const actual = selectNavItems(allNavItemKeys.join(','))
      expect(actual).toEqual(Object.values(allNavigationItems))
    })
    it("ignores named items that don't exist", () => {
      const actual = selectNavItems('bogus,box_buster,random')
      expect(actual).toEqual([allNavigationItems.box_buster])
    })
  })
})
