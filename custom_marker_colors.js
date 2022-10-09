/*
To do:
- Fill out about section
- Add some sort of delete method?
*/

(async function () {
    let aboutAction, defaultColourFunction
    const errorTitle = "Invalid Marker!"
    const errorMessage = 'You have made an invalid marker because you have empty fields. Make sure that you leave no fields blank.'
    const id = "custom_marker_colors"
    const name = "Custom Marker Colors"
    const icon = "extension"
    const author = "SirJain and Geode"
    const links = {
      // Twitter & Discord
      twitter: "https://www.twitter.com/SirJain2",
      discord: "https://discord.gg/wM4CKTbFVN"
    }
    Plugin.register(id, {
      title: name,
      icon,
      author,
      description: "Allows users to add custom marker colors.",
      about: "To be filled out.",
      tags: ["Marker Colors", "Preview", "UX"],
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
                id: "add_custom_marker",
                title: "Add Custom Marker",
                lines: [`
                  <font color="D8CB43", size=2.3px>
                  <b>Keep in mind:</b>
                  </font>
                  <br>
                  <font size=2.3px>
                  - The program will automatically replace any whitespaces with an underscore and capital letters with lowercase <strong>for the marker ID.</strong> (Example: Light Green as a marker ID will become light_green)<br>
                  - No fields should be left blank
                  </font>
                `],
                form: {
                  // line for organization
                  _:"_",
                  name: {label:"Marker Name", type:'text', value:$(`dialog#add_custom_marker #name`).val()},
                  id: {label:"Marker ID", type:'text', value:$(`dialog#add_custom_marker #id`).val()},
                  color: {label:"Choose Color", type:'color', value:"#6E6E6E"}, _:"_"
                },
                onConfirm(formData) {
                  
                  const hexStr = formData.color.toHexString();
                  const id = formData.id.toLowerCase().replace(/\s/g, '_');
                  
                  if (formData.id !== "" && formData.name !== "") {
                    Blockbench.showQuickMessage("Added marker color", 3000)

                    // update marker colors
                    markerColors.push({
                      id: id,
                      name: formData.name,
                      standard: hexStr,
                      pastel: hexStr
                    })

                    Canvas.updateMarkerColorMaterials()
                    console.log(id)
                  }

                  if (formData.id === "" || formData.name === "") {
                    Blockbench.showMessageBox({title: errorTitle, message: errorMessage})
                  }
                },
                onCancel() {
                  // close
                  this.close()
                }
              }).show()
            }
          }].concat("_", defaultColourFunction())
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
            <p>To be filled out.</p>
            <div class="socials">
              <a href="${links["twitter"]}" class="open-in-browser">
                <i class="fa-brands fa-twitter" style="color:#00acee"></i>
                <label>By ${author}</label>
              </a>
              <a href="${links["discord"]}" class="open-in-browser">
                <i class="fa-brands fa-discord" style="color:#5865F2"></i>
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