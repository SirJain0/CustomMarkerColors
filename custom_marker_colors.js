(async function() {
  let aboutAction, defaultColourFunction
  const E = s => $(document.createElement(s))
  const errorTitle = "Invalid Marker!"
  const duplicateIDErrorTitle = "This ID already exists!"
  const errorMessage = 'You have made an invalid marker because you have empty fields. Make sure that you leave no fields blank.'
  const duplicateIDErrorMessage = 'The ID you entered is a duplicate of one of the default marker IDs. Please enter a fresh ID.'
  const id = "custom_marker_colors"
  const name = "Custom Marker Colors"
  const icon = "colorize"
  const author = "SirJain and Geode" 
  const defaultMarkerArray = markerColors.map(e => e.id)
  const links = {
      // Twitter & Discord
      twitter: "https://www.twitter.com/SirJain2",
      twittergeode: "https://twitter.com/GeodeModels",
      discord: "https://discord.gg/wM4CKTbFVN"
  }
  Plugin.register(id, {
      title: name,
      icon,
      author,
      description: "Allows users to add custom marker colors.",
      about: "With this plugin, you can add more marker colors to allow for futher customization.\n## How to use\nSimply go to the menu where you add custom marker colors. Click on the new button named `Add Custom Marker`, fill out the fields leaving nothing blank, and click `Add`. Your color will be added to the default list!",
      tags: ["Marker Color", "Customize", "UX"],
      version: "1.0.0",
      min_version: "4.2.0",
      variant: "both",
      oninstall() { 
        showAbout(true)
        Blockbench.showQuickMessage("Installed Custom Marker Colors!", 3000)
      },
      onload() {
          addAboutButton()
          defaultColourFunction = Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children
          console.log(defaultColourFunction())
          Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = () => {
              return [
                {
                  icon: "fa-plus",
                  name: "Add Custom Marker",
                  color: "#000000",
                  click() {
                      new Blockbench.Dialog({
                          id: "add_custom_marker",
                          title: "Add Custom Marker",
                          buttons:['Add Marker', 'Cancel'],
                          lines: [`
                          <style>
                            input#id {
                              text-transform: lowercase;
                            }
                          </style>
                        `],
                          form: {
                              name: {
                                  label: "Marker Name",
                                  type: 'text',
                                  value: $(`dialog#add_custom_marker #name`).val()
                              },
                              id: {
                                  label: "Marker ID",
                                  type: 'text',
                                  value: $(`dialog#add_custom_marker #id`).val()
                              },
                              color: {
                                  label: "Choose Color",
                                  type: 'color',
                                  value: "#6E6E6E"
                              }
                          },
                          onConfirm(formData) {

                              const hexStr = formData.color.toHexString();

                              // case 1 - ID and name are not blank
                              if ((formData.id !== "" && formData.name !== "") && !(defaultMarkerArray.includes(formData.id))) {
                                  Blockbench.showQuickMessage("Added marker color", 3000)

                                  // update marker colors
                                  markerColors.push({
                                      id: formData.id,
                                      name: formData.name,
                                      standard: hexStr,
                                      pastel: hexStr
                                  })

                                  console.log(markerColors)

                                  Canvas.updateMarkerColorMaterials()
                                  console.log(formData.id)
                              }

                              // case 2 - Duplicate ID
                              if (defaultMarkerArray.includes(formData.id)) {
                                Blockbench.showMessageBox({
                                  title: duplicateIDErrorTitle,
                                  message: duplicateIDErrorMessage
                                })
                              }
                              
                              // case 3 - ID and name are blank
                              if (formData.id === "" || formData.name === "") {
                                  Blockbench.showMessageBox({
                                      title: errorTitle,
                                      message: errorMessage
                                  })
                              }
                          },
                          onCancel() {
                              // close
                              this.close()
                          }
                      }).show()
                      // For replacing spaces with underscores in ID section
                      const inputRef = document.getElementById('id');
                      inputRef.addEventListener('input', () => {
                        const orignalSelectionStart = inputRef.selectionStart;

                        inputRef.value = inputRef.value.toLowerCase().replace(/\s+/, '_');

                        // Reset caret position
                        if (inputRef.createTextRange) {
                            const range = inputRef.createTextRange();
                            range.move(' ', orignalSelectionStart);
                            range.select();
                            return;
                        }
                        
                        inputRef.focus();
                        inputRef?.setSelectionRange?.(orignalSelectionStart, orignalSelectionStart);
                      });
                  }
              },
              {
              icon: "settings",
              name: "Edit Markers",
              color: "#000000",
              type: "button",
              click() {
                new Blockbench.Dialog({
                  id: "edit_marker_colors_dialog",
                  title: "Edit Marker Colors",
                  buttons: ['Close'],
                  lines: [`
                    <style>
                      dialog#edit_marker_colors_dialog #marker-colors {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                      }

                      dialog#edit_marker_colors_dialog .marker-color {
                        display: flex;
                        gap: 10px;
                      }
                      
                      dialog#edit_marker_colors_dialog .marker-color-display {
                        width: 24px;
                        height: 24px;
                        border-radius: 5px;
                      }

                      dialog#edit_marker_colors_dialog .marker-color-remove {
                        font-size: 10px;
                        padding: 100px, 10px, 10px, 10px;
                      }
                    </style>
                    <div id="marker-colors"></div>
                  `]
                }).show()
                const container = $("dialog#edit_marker_colors_dialog #marker-colors")
                for (const color of markerColors) {
                  if (defaultMarkerArray.includes(color.id)) continue;
                  const name = tl(`cube.color.${color.id}`)
                  const markerDisplay = E("div").addClass("marker-color").append(
                    E("div").addClass("marker-color-display").css("background-color", color.standard),
                    E("div").addClass("marker-color-name").text(color.name),
                    E("div").addClass("marker-color-remove").append(`<i class="material-icons icon tool" style="float:right" color="grey">delete</i>`)
                    .on("click", e => {
                      Blockbench.showQuickMessage(`Removed ${color.name} marker`, 3000)
                      const index = markerColors.indexOf(color)
                      markerColors.splice(index, 1)
                      Canvas.emptyMaterials.splice(index, 1)
                      markerDisplay.remove()
                    })
                  ).appendTo(container)
                }
              }
            }].concat("_", defaultColourFunction())
          }
      },
      onunload() {
          aboutAction.delete()
          MenuBar.removeAction(`help.about_plugins.about_${id}`)
          Cube.prototype.menu.structure.find(e => e.name === "menu.cube.color").children = defaultColourFunction
      },
      onuninstall()  {
        Blockbench.showQuickMessage("Uninstalled Custom Marker Colors", 3000)
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
            <p>Allows users to add custom marker colors.</p>
            <h4>Worth noting:</h4>
            <p>- The program will automatically replace any spaces with an underscore and capital letters with lowercase <strong>for the marker ID.</strong> (Example: Light Green as a marker ID will become light_green). Marker names are unaffected.</p>
            <p>- No fields should be left blank when making a custom marker color. An error will pop up if you do.</p>
            <p>- Currently, the only way to get rid of your custom markers altogether is to uninstall the plugin and restart Blockbench.</p>
            <p>- You cannot add new marker colors on a mesh with this plugin, however existing ones do appear on the same list and work for meshes!<p>
            <p>- These marker colors work for keyframe colors as well!<p>
            <h4>How to use:</h4>
            <p>To use this plugin, go to the menu where the marker colors are listed. There will be a brand new <b>Add Custom Marker</b> at the top. Upon clicking, fill out the required information, making sure to leave no fields blank, and you're good to go! The marker is added to the default list, ready to be used.
            <p>Please report any bugs or suggestions you may have to make this plugin more enjoyable for everyone.</p>
            <br>
          <div class="socials">
            <a href="${links["twitter"]}" class="open-in-browser">
              <i class="fa-brands fa-twitter" style="color:#00acee"></i>
              <label>SirJain</label>
            </a>
            <a href="${links["twittergeode"]}" class="open-in-browser">
              <i class="fa-brands fa-twitter" style="color:#00acee"></i>
              <label>Geode</label>
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