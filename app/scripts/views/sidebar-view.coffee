class Pocket.SidebarView extends Pocket.BaseView
  template: 'sidebar'

  handleNavigationStates: (route) ->
    route = route.replace 'route:', ''
    $el = $('nav a[href="/#'+route+'"]').parent()
    unless $el.hasClass("active")
      $("nav li.active").removeClass "active"
      $el.addClass "active"

  afterRender: ->
    @loadAppName()
    pocket.router.bind "all", (route) =>
      @handleNavigationStates Backbone.history.fragment
    @loadModules()
    super

  loadAppName: ->
    window.hoodie.admin.getAppInfo().then(@renderAppName)

  renderAppName: (@appInfo) =>
    @$el.find('header .appName a').text @appInfo.name
    $('.sidebar header .appName').bigtext({
      maxfontsize: 20
    })

  loadModules: ->
    $.when(
      window.hoodie.admin.modules.findAll(),
      window.hoodie.admin.users.getTotal()
    ).then @renderModules

  # Generates module menu with badges
  renderModules: (@modules, @totalUsers) =>
    for key, module of @modules
      module.url = module.id
      module.cleanName = @makeURLHuman module.url
      # Special treatment for the users module: show user amount
      if module.cleanName is "Users"
        module.cleanName = @totalUsers+" "+module.cleanName.toLowerCase()
      module.badgeStatus = 'badge-'+module.status
      if module.messages
        module.messageAmount = module.messages.length
      else
        module.messageAmount = ''

    @$el.find('nav ul.modules').html Handlebars.VM.template(JST['sidebar-modules']) this
