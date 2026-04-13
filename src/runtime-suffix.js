  ];

  for (const module of modules) {
    if (module.match()) {
      module.run();
    }
  }
})();
