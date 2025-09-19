// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
const readline = require("readline-sync");

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";

// Weapon damage (starts at 0 until player buys a sword)
let weaponDamage = 0; // Base weapon damage
let monsterDefense = 5; // Monster's defense value
let healingPotionValue = 30; // How much health is restored

// Item templates with properties
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5, // Cost in gold
  effect: 30, // Healing amount
  description: "Restores 30 health points",
};

const sword = {
  name: "Sword",
  type: "weapon",
  value: 10, // Cost in gold
  effect: 10, // Damage amount
  description: "A sturdy blade for combat",
};

const woodenShield = {
  name: "Wooden Shield",
  type: "armor",
  value: 8, // Cost in gold
  effect: 5, // Protection amount
  description: "Reduces damage taken in combat",
};

const steelSword = {
  name: "Steel Sword",
  type: "weapon",
  value: 20, // Higher cost than basic sword
  effect: 20, // Higher damage than basic sword
  description: "A sharp blade forged from steel. Deals more damage.",
};

const ironShield = {
  name: "Iron Shield",
  type: "armor",
  value: 16, // Higher cost than wooden shield
  effect: 12, // Better protection than wooden shield
  description: "A sturdy iron shield. Greatly reduces damage taken.",
};

// Create empty inventory array (from previous lab)
let inventory = []; // Will now store item objects instead of strings

// ===========================
// Display Functions
// Functions that show game information to the player
// ===========================

/**
 * Shows the player's current stats
 * Displays health, gold, and current location
 */
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);

  // Enhanced inventory display with item details
  console.log("🎒 Inventory: ");
  if (inventory.length === 0) {
    console.log("   Nothing in inventory");
  } else {
    inventory.forEach((item, index) => {
      console.log(
        "   " + (index + 1) + ". " + item.name + " - " + item.description
      );
    });
  }
}

/**
 * Shows the current location's description and available choices
 */
function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");

  if (currentLocation === "village") {
    console.log(
      "You're in a bustling village. The blacksmith and market are nearby."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Go to dragon cave");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The heat from the forge fills the air. Weapons and armor line the walls."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy Items");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "market") {
    console.log(
      "Merchants sell their wares from colorful stalls. A potion seller catches your eye."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy potion (" + healthPotion.value + " gold)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log(
      "The forest is dark and foreboding. You hear strange noises all around you."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use item");
    console.log("4: Help");
    console.log("5: Quit game");
  } else if (currentLocation === "dragon cave") {
    console.log(
      "You stand before the entrance of the dragon's cave. The air is thick with smoke and danger."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Fight the dragon");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  }
}

// ===========================
// Combat Functions
// Functions that handle battles and health
// ===========================

/**
 * Checks if player has an item of specified type
 * @param {string} type The type of item to check for
 * @returns {boolean} True if player has the item type
 */
function hasItemType(type) {
  return inventory.some((item) => item.type === type);
}

/**
 * Handles monster and dragon battles with turn-based combat and hit/miss chances.
 * @param {boolean} isDragon - True if fighting the dragon (boss battle)
 * @returns {boolean} true if player wins, false if they retreat or lose
 */
function handleCombat(isDragon = false) {
  // Monster stats
  let monster = isDragon
    ? { name: "Dragon", damage: 20, health: 50 }
    : { name: "Monster", damage: 10, health: 10 };

  let monsterHealth = monster.health;
  let playerAlive = true;

  let weapon = getBestItem("weapon");
  let armor = getBestItem("armor");
  let playerProtection = armor ? armor.effect : 0;

  if (isDragon) {
    console.log("\n🔥 The DRAGON towers before you! 🔥");
    if (!hasGoodEquipment()) {
      console.log(
        "The dragon's flames are too powerful for your current equipment!"
      );
      updateHealth(-70);
      if (playerHealth > 0) {
        console.log("You barely escape with your life!");
      }
      return false;
    }
    // Turn-based combat loop
    while (monsterHealth > 0 && playerHealth > 0) {
      // Player's turn
      let playerHitChance = Math.random();
      if (playerHitChance < 0.7) { // 70% chance to hit
        let playerDamage = weapon.effect;
        monsterHealth -= playerDamage;
        if (monsterHealth < 0) monsterHealth = 0;
        console.log(
          "You attack with your " +
            weapon.name +
            " (damage: " +
            weapon.effect +
            ")! You hit the dragon for " +
            playerDamage +
            " damage! (Dragon health: " +
            monsterHealth +
            ")"
        );
      } else {
        console.log("You swing your " + weapon.name + ", but miss the dragon!");
      }
      if (monsterHealth <= 0) break;

      // Dragon's turn
      let dragonHitChance = Math.random();
      if (dragonHitChance < 0.7) { // 70% chance to hit
        let incoming = monster.damage;
        let reduced = Math.max(1, incoming - playerProtection);
        updateHealth(-reduced);
        console.log(
          "The dragon attacks! You receive " +
            incoming +
            " damage, but your armor blocks " +
            playerProtection +
            ". You take " +
            reduced +
            " damage! (Your health: " +
            playerHealth +
            ")"
        );
      } else {
        console.log("The dragon breathes fire, but you dodge the attack!");
      }
    }

    if (monsterHealth <= 0) {
      console.log("With skill and courage, you slay the dragon!");
      console.log("🏆 You are victorious! The kingdom is saved!");
      playerGold += 100;
      showVictory();
      gameRunning = false;
      return true;
    } else if (playerHealth <= 0) {
      console.log("The dragon has defeated you...");
      return false;
    }
  } else {
    // Regular monster battle with turn-based combat
    while (monsterHealth > 0 && playerHealth > 0) {
      // Player's turn
      let playerHitChance = Math.random();
      if (playerHitChance < 0.7) { // 70% chance to hit
        let playerDamage = weapon.effect;
        monsterHealth -= playerDamage;
        if (monsterHealth < 0) monsterHealth = 0;
        console.log(
          "You attack with your " +
            weapon.name +
            " (damage: " +
            weapon.effect +
            ")! You hit the monster for " +
            playerDamage +
            " damage! (Monster health: " +
            monsterHealth +
            ")"
        );
      } else {
        console.log("You swing your " + weapon.name + ", but miss the monster!");
      }
      if (monsterHealth <= 0) break;

      // Monster's turn
      let monsterHitChance = Math.random();
      if (monsterHitChance < 0.6) { // 60% chance to hit
        let incoming = monster.damage;
        let reduced = Math.max(1, incoming - playerProtection);
        updateHealth(-reduced);
        console.log(
          "The monster attacks! You receive " +
            incoming +
            " damage, but your armor blocks " +
            playerProtection +
            ". You take " +
            reduced +
            " damage! (Your health: " +
            playerHealth +
            ")"
        );
      } else {
        console.log("The monster lunges at you, but misses!");
      }
    }

    if (monsterHealth <= 0) {
      console.log("Victory! You found 10 gold!");
      playerGold += 10;
      return true;
    } else if (playerHealth <= 0) {
      console.log("You have been defeated by the monster...");
      return false;
    }
  }
}

/**
 * Displays the victory message and final stats when the dragon is defeated.
 */
function showVictory() {
  console.log("\n=================================");
  console.log("         🎉 VICTORY! 🎉         ");
  console.log("=================================");
  console.log("Congratulations, " + playerName + "!");
  console.log("You have defeated the mighty dragon and saved the kingdom!");
  console.log("\n--- Final Stats ---");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("🎒 Inventory: ");
  if (inventory.length === 0) {
    console.log("   Nothing in inventory");
  } else {
    inventory.forEach((item, index) => {
      console.log(
        "   " + (index + 1) + ". " + item.name + " - " + item.description
      );
    });
  }
  console.log("\nThank you for playing The Dragon's Quest!");
}

// ===========================
// Item Functions
// Functions that handle item usage and inventory
// ===========================

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem() {
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name);
  });

  let choice = readline.question("Use which item? (number or 'cancel'): ");
  if (choice === "cancel") return false;

  let index = parseInt(choice) - 1;
  if (index >= 0 && index < inventory.length) {
    let item = inventory[index];

    if (item.type === "potion") {
      console.log("\nYou drink the " + item.name + ".");
      updateHealth(item.effect);
      inventory.splice(index, 1);
      console.log("Health restored to: " + playerHealth);
      return true;
    } else if (item.type === "weapon") {
      console.log("\nYou ready your " + item.name + " for battle.");
      return true;
    }
  } else {
    console.log("\nInvalid item number!");
  }
  return false;
}

/**
 * Displays the player's inventory
 */
function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (inventory.length === 0) {
    console.log("Your inventory is empty!");
    return;
  }

  // Display all inventory items with numbers and descriptions
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name + " - " + item.description);
  });
}

/**
 * Returns all items in inventory matching the given type
 * @param {string} type - The type of item to search for (e.g., "weapon", "armor")
 * @returns {Array} Array of matching item objects
 */
function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

/**
 * Returns the item of the given type with the highest effect value
 * @param {string} type - The type of item to search for
 * @returns {Object|null} The best item object or null if none found
 */
function getBestItem(type) {
  const items = getItemsByType(type);
  if (items.length === 0) return null;
  return items.reduce(
    (best, item) => (item.effect > best.effect ? item : best),
    items[0]
  );
}

// ===========================
// Shopping Functions
// Functions that handle buying items
// ===========================

/**
 * Handles purchasing items at the blacksmith (weapons and armor)
 */
function buyFromBlacksmith() {
  console.log("\n=== BLACKSMITH SHOP ===");
  const shopItems = [
    sword,
    woodenShield,
    steelSword,
    ironShield
  ];
  shopItems.forEach((item, idx) => {
    console.log(
      (idx + 1) +
      ": " +
      item.name +
      " (" +
      item.value +
      " gold) - " +
      item.description
    );
  });
  console.log((shopItems.length + 1) + ": Cancel");

  let choice = readline.question("Buy which item? (number): ");
  let index = parseInt(choice) - 1;

  if (index === shopItems.length || isNaN(index)) {
    console.log("Returning to blacksmith menu.");
    return;
  }

  if (index >= 0 && index < shopItems.length) {
    let item = shopItems[index];
    if (playerGold >= item.value) {
      playerGold -= item.value;
      inventory.push({ ...item });
      console.log(
        "You bought a " +
          item.name +
          " for " +
          item.value +
          " gold! (" +
          item.description +
          ")"
      );
      console.log("Gold remaining: " + playerGold);
    } else {
      console.log("Not enough gold for " + item.name + "!");
    }
  } else {
    console.log("Invalid choice.");
  }
}

/**
 * Handles purchasing items at the market (potions)
 */
function buyFromMarket() {
  console.log("\n=== MARKET STALL ===");
  console.log(
    "1: " +
      healthPotion.name +
      " (" +
      healthPotion.value +
      " gold) - " +
      healthPotion.description
  );
  console.log("2: Cancel");

  let choice = readline.question("Buy which item? (number): ");
  let index = parseInt(choice);

  if (index === 2 || isNaN(index)) {
    console.log("Returning to market menu.");
    return;
  }

  if (index === 1) {
    if (playerGold >= healthPotion.value) {
      playerGold -= healthPotion.value;
      inventory.push({ ...healthPotion });
      console.log(
        "You bought a " +
          healthPotion.name +
          " for " +
          healthPotion.value +
          " gold! (" +
          healthPotion.description +
          ")"
      );
      console.log("Gold remaining: " + playerGold);
    } else {
      console.log("Not enough gold for " + healthPotion.name + "!");
    }
  } else {
    console.log("Invalid choice.");
  }
}

// ===========================
// Help System
// Provides information about available commands
// ===========================

/**
 * Shows all available game commands and how to use them
 */
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\nMovement Commands:");
  console.log("- In the village, choose 1-3 to travel to different locations");
  console.log(
    "- In other locations, choose the return option to go back to the village"
  );

  console.log("\nBattle Information:");
  console.log("- You need a weapon to win battles");
  console.log("- Weapons have different damage values");
  console.log("- Monsters appear in the forest");
  console.log("- Without a weapon, you'll lose health when retreating");

  console.log("\nItem Usage:");
  console.log("- Health potions restore health based on their effect value");
  console.log(
    "- You can buy potions at the market for " + healthPotion.value + " gold"
  );
  console.log(
    "- You can buy a sword at the blacksmith for " + sword.value + " gold"
  );

  console.log("\nOther Commands:");
  console.log("- Choose the status option to see your health and gold");
  console.log("- Choose the help option to see this message again");
  console.log("- Choose the quit option to end the game");

  console.log("\nTips:");
  console.log("- Keep healing potions for dangerous areas");
  console.log("- Defeat monsters to earn gold");
  console.log("- Health can't go above 100");
}

// ===========================
// Movement Functions
// Functions that handle player movement
// ===========================

/**
 * Handles movement between locations, including equipment checks for dangerous areas.
 * @param {number} choiceNum The chosen option number
 * @returns {boolean} True if movement was successful, false otherwise
 */
function move(choiceNum) {
  let validMove = false;

  if (currentLocation === "village") {
    if (choiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nYou enter the blacksmith's shop.");
      validMove = true;
    } else if (choiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market.");
      validMove = true;
    } else if (choiceNum === 3) {
      // Entering the forest: check for weapon
      if (!hasItemType("weapon")) {
        console.log("\nIt's too dangerous to enter the forest without a weapon!");
        validMove = false;
      } else {
        currentLocation = "forest";
        console.log("\nYou venture into the forest...");
        validMove = true;
        // Trigger combat when entering forest
        console.log("\nA monster appears!");
        if (!handleCombat()) {
          currentLocation = "village";
        }
      }
    } else if (choiceNum === 4) {
      // Entering dragon cave: check for weapon and armor
      if (!hasGoodEquipment()) {
        console.log("\nYou need a steel sword and some armor to face the dragon!");
        validMove = false;
      } else {
        currentLocation = "dragon cave";
        console.log("\nYou approach the dragon's cave...");
        validMove = true;
      }
    }
  } else if (currentLocation === "blacksmith") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "market") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "forest") {
    if (choiceNum === 1) {
      currentLocation = "village";
      console.log("\nYou hurry back to the safety of the village.");
      validMove = true;
    }
  } else if (currentLocation === "dragon cave") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village, leaving the dragon behind for now.");
      validMove = true;
    }
  }

  return validMove;
}

// ===========================
// Input Validation
// Functions that validate player input
// ===========================

/**
 * Validates if a choice number is within valid range
 * @param {string} input The user input to validate
 * @param {number} max The maximum valid choice number
 * @returns {boolean} True if choice is valid
 */
function isValidChoice(input, max) {
  if (input === "") return false;
  let num = parseInt(input);
  return !isNaN(num) && num >= 1 && num <= max;
}

/**
 * Checks if the player has good enough equipment to face the dragon.
 * Requires the advanced weapon (steel sword) and any armor.
 * @returns {boolean} True if well-equipped, false otherwise
 */
function hasGoodEquipment() {
  const hasSteelSword = inventory.some(
    (item) => item.type === "weapon" && item.name === "Steel Sword"
  );
  const hasAnyArmor = inventory.some((item) => item.type === "armor");
  return hasSteelSword && hasAnyArmor;
}

/**
 * Updates the player's health, ensuring it stays between 0 and 100.
 * @param {number} amount The amount to add (or subtract) from health
 */
function updateHealth(amount) {
  playerHealth += amount;
  if (playerHealth > 100) playerHealth = 100;
  if (playerHealth < 0) playerHealth = 0;
}

// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================

if (require.main === module) {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  // Get player's name
  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");

  while (gameRunning) {
    // Show current location and choices
    showLocation();

    // Get and validate player choice
    let validChoice = false;
    while (!validChoice) {
      try {
        let choice = readline.question("\nEnter choice (number): ");

        // Validate input based on current location
        let maxChoice = 1;
        if (currentLocation === "village") maxChoice = 8;
        else if (currentLocation === "blacksmith") maxChoice = 6;
        else if (currentLocation === "market") maxChoice = 6;
        else if (currentLocation === "forest") maxChoice = 5;
        else if (currentLocation === "dragon cave") maxChoice = 6;

        if (!isValidChoice(choice, maxChoice)) {
          throw `Please enter a number between 1 and ${maxChoice}.`;
        }

        let choiceNum = parseInt(choice);
        validChoice = true;

        // Handle choices based on location
        if (currentLocation === "village") {
          if (choiceNum >= 1 && choiceNum <= 4) {
            move(choiceNum);
          } else if (choiceNum === 5) {
            showStatus();
          } else if (choiceNum === 6) {
            useItem();
          } else if (choiceNum === 7) {
            showHelp();
          } else if (choiceNum === 8) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "blacksmith") {
          if (choiceNum === 1) {
            buyFromBlacksmith();
          } else if (choiceNum === 2) {
            currentLocation = "village";
            console.log("\nYou return to the village center.");
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "market") {
          if (choiceNum === 1) {
            buyFromMarket();
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "forest") {
          if (choiceNum === 1) {
            move(choiceNum);
          } else if (choiceNum === 2) {
            showStatus();
          } else if (choiceNum === 3) {
            useItem();
          } else if (choiceNum === 4) {
            showHelp();
          } else if (choiceNum === 5) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "dragon cave") {
          if (choiceNum === 1) {
            handleCombat(true);
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        }
      } catch (error) {
        console.log("\nError: " + error);
        console.log("Please try again!");
      }
    }

    // Check if player died
    if (playerHealth <= 0) {
      console.log("\nGame Over! Your health reached 0!");
      gameRunning = false;
    }
  }
}
