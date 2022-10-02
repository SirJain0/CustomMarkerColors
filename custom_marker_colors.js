(async function () {
    let aboutAction, defaultColourFunction
    const id = "template"
    const name = "Template"
    const icon = "extension"
    const author = "Author Name"
    const links = {
      website: "https://google.com/",
      discord: "https://discord.com/"
    }
    Plugin.register(id, {
      title: name,
      icon,
      author,
      description: "placeholder",
      about: "placeholder",
      tags: ["placeholder"],
      version: "1.0.0",
      min_version: "4.2.0",
      variant: "both",
      oninstall: () => showAbout(true),
      onload() {
        addAboutButton()
        defaultColourFunction = Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children
        Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = () => {
        return [{
          icon: "fa-plus",
          name: "Add Custom Color",
          color: "#000000",
          click() {
            new Blockbench.Dialog({
              id: "test-dialog",
              title: "This is a dialog!",
              lines: [`
                <h1>This is a dialog!</h1>
              `]
            }).show()
          }
        }].concat(defaultColourFunction())
      }
      },
      onunload() {
        aboutAction.delete()
        MenuBar.removeAction(`help.about_plugins.about_${id}`)
        Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = defaultColourFunction
      }
    })
    function addAboutButton() {
      let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
      if (!about) {
        about = new Action("about_plugins", {
          name: "About Plugins...",
          icon: "info",
          children: []
        })
        MenuBar.addAction(about, "help")
      }
      aboutAction = new Action(`about_${id}`, {
        name: `About ${name}...`,
        icon,
        click: () => showAbout()
      })
      about.children.push(aboutAction)
    }
    function showAbout(banner) {
      const infoBox = new Dialog({
        id: "about",
        title: name,
        width: 780,
        buttons: [],
        lines: [`
          <style>
            dialog#about .dialog_title {
              padding-left: 0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            dialog#about .dialog_content {
              text-align: left!important;
              margin: 0!important;
            }
            dialog#about .socials {
              padding: 0!important;
            }
            dialog#about #banner {
              background-color: var(--color-accent);
              color: var(--color-accent_text);
              width: 100%;
              padding: 0 8px
            }
            dialog#about #content {
              margin: 24px;
            }
          </style>
          ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
          <div id="content">
            <h1 style="margin-top:-10px">${name}</h1>
            <p>placeholder</p>
            <div class="socials">
              <a href="${links["website"]}" class="open-in-browser">
                <i class="icon material-icons" style="color:#33E38E">language</i>
                <label>By ${author}</label>
              </a>
              <a href="${links["discord"]}" class="open-in-browser">
                <i class="icon fab fa-discord" style="color:#727FFF"></i>
                <label>Discord Server</label>
              </a>
            </div>
          </div>
        `]
      }).show()
      $("dialog#about .dialog_title").html(`
        <i class="icon material-icons">${icon}</i>
        ${name}
      `)
    }
  })()