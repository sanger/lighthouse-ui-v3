const allNavigationItems = {
  reports: { path: '/reports', title: 'Reports' },
  box_buster: { path: '/box_buster', title: 'Box Buster' },
  sentinel_create_samples: { path: '/sentinel_create_samples', title: 'Sentinel Sample Creation' },
  sentinel_cherrypick: { path: '/sentinel_cherrypick', title: 'Sentinel Cherrypick' },
  imports: { path: '/imports', title: 'Imports' },
  print_labels: { path: '/print_labels', title: 'Print Labels' },
  beckman_cherrypick: { path: '/beckman_cherrypick', title: 'Beckman Cherrypick' },
  biosero_plate_state: { path: '/biosero_plate_state', title: 'Biosero Plate State' },
  biosero_cherrypick: { path: '/biosero_cherrypick', title: 'Biosero Cherrypick' },
  uat_actions: { path: '/uat_actions/generate_test_run', title: 'UAT Actions' },
}

export const prepareNavItems = (enabledNavItems) => {
  const enabledKeys = enabledNavItems.split(',')
  return enabledKeys
    .map((key) => (Object.keys(allNavigationItems).includes(key) ? allNavigationItems[key] : null))
    .filter((item) => item)
}
