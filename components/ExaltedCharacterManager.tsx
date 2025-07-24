'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, User, ChevronDown, ChevronRight, Shield, Swords, BookOpen, TrendingUp, Users, Scroll, Construction, Download, Upload } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ExaltedCharacterManager = () => {
  const [characters, setCharacters, charactersLoaded] = useLocalStorage<any[]>('exalted-characters', []);
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);
  const [showCharacterSelect, setShowCharacterSelect] = useState(true);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [showAdvancementLog, setShowAdvancementLog] = useState(false);
  const [activeTab, setActiveTab] = useState('core');
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState('none');
  const [showAbout, setShowAbout] = useState(false);
  const fileInputRef = useRef(null);
  const characterFileInputRef = useRef(null);

  // Default character template
  const createNewCharacter = (name: string) => ({
    id: Date.now(),
    name,
    attributes: {
      fortitude: { base: 1, added: 0, bonus: 0 },
      finesse: { base: 1, added: 0, bonus: 0 },
      force: { base: 1, added: 0, bonus: 0 }
    },
    abilities: {
      athletics: { base: 0, added: 0, bonus: 0 },
      awareness: { base: 0, added: 0, bonus: 0 },
      closeCombat: { base: 0, added: 0, bonus: 0 },
      craft: { base: 0, added: 0, bonus: 0 },
      embassy: { base: 0, added: 0, bonus: 0 },
      integrity: { base: 0, added: 0, bonus: 0 },
      navigate: { base: 0, added: 0, bonus: 0 },
      physique: { base: 0, added: 0, bonus: 0 },
      presence: { base: 0, added: 0, bonus: 0 },
      performance: { base: 0, added: 0, bonus: 0 },
      rangedCombat: { base: 0, added: 0, bonus: 0 },
      sagacity: { base: 0, added: 0, bonus: 0 },
      stealth: { base: 0, added: 0, bonus: 0 },
      war: { base: 0, added: 0, bonus: 0 }
    },
    essence: {
      motes: 5,
      commitments: 0,
      spent: 0,
      anima: 0,
      rating: 1
    },
    staticValues: {
      defenseModifier: 0,
      evasionModifier: 0,
      parryModifier: 0,
      resolveModifier: 0,
      soakModifier: 0,
      hardnessModifier: 0
    },
    health: {
      baseline: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
      oxBodyLevels: 0,
      exaltType: 'lunar',
      bashingDamage: 0,
      lethalDamage: 0,
      aggravatedDamage: 0,
      dramaticInjuries: []
    },
    armor: [],
    weapons: [],
    milestones: {
      personal: 0,
      exalt: 0,
      minor: 0,
      major: 0
    },
    advancement: [],
    dicePool: {
      attribute: 'fortitude',
      ability: 'athletics',
      targetNumber: 7,
      doublesThreshold: 10,
      extraDiceBonus: 0,
      extraDiceNonBonus: 0,
      extraSuccessBonus: 0,
      extraSuccessNonBonus: 0
    },
    charms: [],
    spells: [],
    combat: {
      power: 0,
      joinBattleBonus: 0
    },
    social: {
      virtues: {
        major: null,
        minor: null
      },
      intimacies: []
    },
    rulings: []
  });

  // Load characters from localStorage on mount
  useEffect(() => {
    const savedCharacters = localStorage.getItem('exalted-characters');
    if (savedCharacters) {
      const parsed = JSON.parse(savedCharacters);
      // Ensure all characters have the latest structure
      const updatedCharacters = parsed.map(char => ({
        ...createNewCharacter(char.name),
        ...char,
        essence: {
          motes: 5,
          commitments: 0,
          spent: 0,
          anima: 0,
          rating: 1,
          ...char.essence
        },
        staticValues: {
          defenseModifier: 0,
          evasionModifier: 0,
          parryModifier: 0,
          resolveModifier: 0,
          soakModifier: 0,
          hardnessModifier: 0,
          ...char.staticValues
        },
        health: {
          baseline: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
          oxBodyLevels: 0,
          exaltType: 'lunar',
          bashingDamage: 0,
          lethalDamage: 0,
          aggravatedDamage: 0,
          dramaticInjuries: [],
          ...(char.health || {})
        },
        armor: char.armor || [],
        weapons: char.weapons || [],
        milestones: {
          personal: 0,
          exalt: 0,
          minor: 0,
          major: 0,
          ...char.milestones
        },
        advancement: char.advancement || [],
        dicePool: char.dicePool || {
          attribute: 'fortitude',
          ability: 'athletics',
          targetNumber: 7,
          doublesThreshold: 10,
          extraDiceBonus: 0,
          extraDiceNonBonus: 0,
          extraSuccessBonus: 0,
          extraSuccessNonBonus: 0
        },
        charms: char.charms || [],
        spells: char.spells || [],
        combat: char.combat || {
          power: 0,
          joinBattleBonus: 0
        },
        social: (() => {
          if (!char.social) {
            return {
              virtues: { major: null, minor: null },
              intimacies: []
            };
          }
          // Handle old array format for virtues
          if (Array.isArray(char.social.virtues)) {
            return {
              virtues: {
                major: char.social.virtues[0] || null,
                minor: char.social.virtues[1] || null
              },
              intimacies: char.social.intimacies || []
            };
          }
          // Already in new format
          return {
            virtues: char.social.virtues || { major: null, minor: null },
            intimacies: char.social.intimacies || []
          };
        })(),
        rulings: char.rulings || []
      }));
      setCharacters(updatedCharacters);
      if (updatedCharacters.length > 0) {
        setCurrentCharacter(updatedCharacters[0]);
        setShowCharacterSelect(false);
      }
    }
  }, [setCharacters]);

  // Save characters to localStorage whenever characters change
  useEffect(() => {
    if (characters.length > 0) {
      localStorage.setItem('exalted-characters', JSON.stringify(characters));
    }
  }, [characters]);

  const handleCreateCharacter = () => {
    if (!newCharacterName.trim()) return;
    
    const newChar = createNewCharacter(newCharacterName.trim());
    setCharacters(prev => [...prev, newChar]);
    setCurrentCharacter(newChar);
    setNewCharacterName('');
    setShowCharacterSelect(false);
  };

  const handleDeleteCharacter = (id) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
    if (currentCharacter && currentCharacter.id === id) {
      setCurrentCharacter(null);
      setShowCharacterSelect(true);
    }
  };

  const handleSelectCharacter = (character) => {
    setCurrentCharacter(character);
    setShowCharacterSelect(false);
  };

  // Simple markdown renderer for about content
  const renderMarkdown = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactElement[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-xl font-semibold mb-2 mt-4">{line.substring(3)}</h2>);
      } else if (line.trim()) {
        elements.push(<p key={index} className="mb-2">{line}</p>);
      }
    });
    
    return elements;
  };

  // About content
  const aboutContent = `# Exalted: Essence Character Manager

## Overview
This is a character management application for the Exalted: Essence tabletop role-playing game. It allows you to create, manage, and track character progression.

## Features
- Character creation and management
- Attribute and ability tracking
- Essence management
- Health tracking
- Armor and weapon management
- Dice pool calculator
- Import/export functionality`;

  // Export character to JSON file
  const exportCharacter = (character) => {
    try {
      const dataStr = JSON.stringify(character, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(dataBlob);
      link.href = url;
      link.download = `${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_exalted_character.json`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export character. Please try again.');
    }
  };

  // Export all characters
  const exportAllCharacters = () => {
    try {
      const dataStr = JSON.stringify(characters, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(dataBlob);
      link.href = url;
      link.download = 'all_exalted_characters.json';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export characters. Please try again.');
    }
  };

  // Import character from JSON file
  const importCharacter = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Check if it's a single character or array of characters
        const isArray = Array.isArray(importedData);
        const charactersToImport = isArray ? importedData : [importedData];
        
        // Validate and merge with default structure
        const validatedCharacters = charactersToImport.map(char => {
          // Ensure the character has a name
          if (!char.name) {
            throw new Error('Invalid character data: missing name');
          }
          
          // Generate new ID to avoid conflicts
          const newId = Date.now() + Math.random();
          
          // Merge with default structure to ensure all fields exist
          return {
            ...createNewCharacter(char.name),
            ...char,
            id: newId
          };
        });
        
        // Add to characters list
        setCharacters(prev => [...prev, ...validatedCharacters]);
        
        // If only one character imported, select it
        if (validatedCharacters.length === 1) {
          setCurrentCharacter(validatedCharacters[0]);
          setShowCharacterSelect(false);
        }
        
        // Reset file input
        event.target.value = '';
        
        alert(`Successfully imported ${validatedCharacters.length} character(s)`);
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import character(s). Please ensure the file is a valid character export.');
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const updateCharacterValue = (section, key, field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    
    setCurrentCharacter(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...prev[section][key],
          [field]: numValue
        }
      }
    }));

    // Update in characters array
    setCharacters(prev => 
      prev.map(char => 
        char.id === currentCharacter.id 
          ? {
              ...char,
              [section]: {
                ...char[section],
                [key]: {
                  ...char[section][key],
                  [field]: numValue
                }
              }
            }
          : char
      )
    );
  };

  const updateEssenceValue = (field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    
    setCurrentCharacter(prev => ({
      ...prev,
      essence: {
        ...prev.essence,
        [field]: numValue
      }
    }));

    setCharacters(prev => 
      prev.map(char => 
        char.id === currentCharacter.id 
          ? {
              ...char,
              essence: {
                ...char.essence,
                [field]: numValue
              }
            }
          : char
      )
    );
  };

  const calculateTotal = (stat) => {
    return stat.base + stat.added + stat.bonus;
  };

  const calculateRemainEssence = () => {
    if (!currentCharacter?.essence) return 0;
    const { motes, commitments, spent } = currentCharacter.essence;
    return motes - commitments - spent;
  };

  const calculateOpenEssence = () => {
    if (!currentCharacter?.essence) return 0;
    const { motes, commitments } = currentCharacter.essence;
    return motes - commitments;
  };

  // Anima rulings system
  const getAnimaLevel = (anima) => {
    if (anima <= 2) return 'Dim';
    if (anima <= 4) return 'Glowing';
    if (anima <= 6) return 'Burning';
    if (anima <= 9) return 'Bonfire';
    return 'Iconic';
  };

  const getActiveAnimaRulings = (anima: number): string[] => {
    const rulings: string[] = [];
    if (anima >= 3) rulings.push('Anima Active Effect available');
    if (anima >= 5) rulings.push("Exalted nature can't be hidden");
    return rulings;
  };

  // Advancement tracking
  const addAdvancementEntry = () => {
    if (!currentCharacter) return;
    
    const newEntry = {
      id: Date.now(),
      item: '',
      status: 'Planned',
      timestamp: new Date().toLocaleDateString()
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      advancement: [...(currentCharacter.advancement || []), newEntry]
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateAdvancementEntry = (id, field, value) => {
    if (!currentCharacter?.advancement) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      advancement: currentCharacter.advancement.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteAdvancementEntry = (id) => {
    if (!currentCharacter?.advancement) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      advancement: currentCharacter.advancement.filter(entry => entry.id !== id)
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Static Values Calculations
  const getHighestAttribute = () => {
    if (!currentCharacter?.attributes) return 0;
    const { fortitude, finesse, force } = currentCharacter.attributes;
    return Math.max(
      calculateTotal(fortitude),
      calculateTotal(finesse),
      calculateTotal(force)
    );
  };

  const calculateEvasion = () => {
    if (!currentCharacter?.abilities?.athletics) return 0;
    const athletics = calculateTotal(currentCharacter.abilities.athletics);
    const highestAttr = getHighestAttribute();
    const base = Math.ceil((athletics + highestAttr) / 2);
    const modifier = currentCharacter?.staticValues?.evasionModifier || 0;
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)));
  };

  const calculateParry = () => {
    if (!currentCharacter?.abilities?.closeCombat) return 0;
    const closeCombat = calculateTotal(currentCharacter.abilities.closeCombat);
    const highestAttr = getHighestAttribute();
    const base = Math.ceil((closeCombat + highestAttr) / 2);
    const modifier = currentCharacter?.staticValues?.parryModifier || 0;
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)));
  };

  const calculateDefense = () => {
    const evasion = calculateEvasion();
    const parry = calculateParry();
    const base = Math.max(evasion, parry);
    const modifier = currentCharacter?.staticValues?.defenseModifier || 0;
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)));
  };

  const calculateResolve = () => {
    if (!currentCharacter?.abilities?.integrity) return 2;
    const integrity = calculateTotal(currentCharacter.abilities.integrity);
    let base = 2;
    if (integrity >= 1) base += 1;
    if (integrity >= 3) base += 2;
    const modifier = currentCharacter?.staticValues?.resolveModifier || 0;
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)));
  };

  const calculateSoak = () => {
    if (!currentCharacter?.abilities?.physique) return 1;
    const physique = calculateTotal(currentCharacter.abilities.physique);
    let base = 1;
    if (physique >= 3) base += 1;
    const armorSoak = getTotalArmorSoak();
    const modifier = currentCharacter?.staticValues?.soakModifier || 0;
    return Math.max(0, base + armorSoak + Math.max(-5, Math.min(5, modifier)));
  };

  const calculateHardness = () => {
    const essence = currentCharacter?.essence?.rating || 1;
    const base = essence + 2;
    const armorHardness = getTotalArmorHardness();
    const modifier = currentCharacter?.staticValues?.hardnessModifier || 0;
    return Math.max(0, base + armorHardness + Math.max(-5, Math.min(5, modifier)));
  };

  // Health Track Calculations
  const calculateHealthLevels = () => {
    const baseline = currentCharacter?.health?.baseline || { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 };
    const oxBodyLevels = Math.max(0, Math.min(5, currentCharacter?.health?.oxBodyLevels || 0));
    const exaltType = currentCharacter?.health?.exaltType || 'lunar';
    
    let oxBodyZero = 0, oxBodyMinusOne = 0;
    if (exaltType === 'lunar') {
      oxBodyZero = oxBodyLevels * 2;
      oxBodyMinusOne = oxBodyLevels * 1;
    }
    
    return {
      zero: baseline.zero + oxBodyZero,
      minusOne: baseline.minusOne + oxBodyMinusOne,
      minusTwo: baseline.minusTwo,
      incap: baseline.incap,
      total: baseline.zero + oxBodyZero + baseline.minusOne + oxBodyMinusOne + baseline.minusTwo + baseline.incap
    };
  };

  const calculateHealthPenalty = () => {
    const levels = calculateHealthLevels();
    const bashingDamage = currentCharacter?.health?.bashingDamage || 0;
    const lethalDamage = currentCharacter?.health?.lethalDamage || 0;
    const aggravatedDamage = currentCharacter?.health?.aggravatedDamage || 0;
    
    // Total damage taken
    const totalDamage = bashingDamage + lethalDamage + aggravatedDamage;
    
    if (totalDamage === 0) return 0;
    if (totalDamage <= levels.zero) return 0;
    if (totalDamage <= levels.zero + levels.minusOne) return -1;
    if (totalDamage <= levels.zero + levels.minusOne + levels.minusTwo) return -2;
    return -99; // Incapacitated
  };

  const addDramaticInjury = () => {
    if (!currentCharacter) return;
    
    const newInjury = {
      id: Date.now(),
      description: '',
      healed: false
    };
    
    updateHealthValue('dramaticInjuries', [...(currentCharacter.health?.dramaticInjuries || []), newInjury]);
  };

  const updateDramaticInjury = (id, field, value) => {
    if (!currentCharacter?.health?.dramaticInjuries) return;
    
    const updatedInjuries = currentCharacter.health.dramaticInjuries.map(injury =>
      injury.id === id ? { ...injury, [field]: value } : injury
    );
    
    updateHealthValue('dramaticInjuries', updatedInjuries);
  };

  const deleteDramaticInjury = (id) => {
    if (!currentCharacter?.health?.dramaticInjuries) return;
    
    const updatedInjuries = currentCharacter.health.dramaticInjuries.filter(injury => injury.id !== id);
    updateHealthValue('dramaticInjuries', updatedInjuries);
  };

  const toggleInjuryHealed = (id) => {
    if (!currentCharacter?.health?.dramaticInjuries) return;
    
    const updatedInjuries = currentCharacter.health.dramaticInjuries.map(injury =>
      injury.id === id ? { ...injury, healed: !injury.healed } : injury
    );
    
    updateHealthValue('dramaticInjuries', updatedInjuries);
  };

  // Armor Management
  const addArmor = () => {
    if (!currentCharacter) return;
    
    const newArmor = {
      id: Date.now(),
      name: '',
      type: 'light',
      soak: 0,
      hardness: 0,
      mobility: 0,
      tags: ''
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      armor: [...(currentCharacter.armor || []), newArmor]
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateArmor = (id, field, value) => {
    if (!currentCharacter?.armor) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      armor: currentCharacter.armor.map(armor =>
        armor.id === id ? { ...armor, [field]: value } : armor
      )
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteArmor = (id) => {
    if (!currentCharacter?.armor) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      armor: currentCharacter.armor.filter(armor => armor.id !== id)
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const getTotalArmorSoak = () => {
    return (currentCharacter?.armor || [])
      .reduce((total, armor) => total + (parseInt(armor.soak) || 0), 0);
  };

  const getTotalArmorHardness = () => {
    return (currentCharacter?.armor || [])
      .reduce((total, armor) => total + (parseInt(armor.hardness) || 0), 0);
  };

  // Weapons Management
  const addWeapon = () => {
    if (!currentCharacter) return;
    
    const newWeapon = {
      id: Date.now(),
      name: '',
      accuracy: 0,
      damage: 0,
      defence: 0,
      overwhelming: 0,
      range: 'close',
      tags: ''
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      weapons: [...(currentCharacter.weapons || []), newWeapon]
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateWeapon = (id, field, value) => {
    if (!currentCharacter?.weapons) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      weapons: currentCharacter.weapons.map(weapon =>
        weapon.id === id ? { ...weapon, [field]: value } : weapon
      )
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteWeapon = (id) => {
    if (!currentCharacter?.weapons) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      weapons: currentCharacter.weapons.filter(weapon => weapon.id !== id)
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateHealthValue = (field, value) => {
    const updatedCharacter = {
      ...currentCharacter,
      health: {
        baseline: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
        oxBodyLevels: 0,
        exaltType: 'lunar',
        bashingDamage: 0,
        lethalDamage: 0,
        aggravatedDamage: 0,
        dramaticInjuries: [],
        ...currentCharacter.health,
        [field]: value
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Milestone and Advancement Counting
  const countAdvancementsByStatus = () => {
    const advancement = currentCharacter?.advancement || [];
    const counts = {
      planned: 0,
      personal: 0,
      exalt: 0,
      minor: 0,
      major: 0
    };
    
    advancement.forEach(entry => {
      switch(entry.status) {
        case 'Planned':
          counts.planned++;
          break;
        case 'Paid with Personal':
          counts.personal++;
          break;
        case 'Paid with Exalt':
          counts.exalt++;
          break;
        case 'Paid with Minor':
          counts.minor++;
          break;
        case 'Paid with Major':
          counts.major++;
          break;
      }
    });
    
    return counts;
  };

  const updateMilestone = (type, value) => {
    const updatedCharacter = {
      ...currentCharacter,
      milestones: {
        ...currentCharacter.milestones,
        [type]: Math.max(0, parseInt(value) || 0)
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Static Values Modifier Updates
  const updateStaticValueModifier = (field, value) => {
    const numValue = Math.max(-5, Math.min(5, parseInt(value) || 0));
    
    const updatedCharacter = {
      ...currentCharacter,
      staticValues: {
        ...currentCharacter.staticValues,
        [field]: numValue
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Charms and Spells Management
  const addCharm = () => {
    if (!currentCharacter) return;
    
    const newCharm = {
      id: Date.now(),
      name: '',
      step: 1,
      cost: '',
      description: '',
      pageReference: ''
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      charms: [...(currentCharacter.charms || []), newCharm]
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateCharm = (id, field, value) => {
    if (!currentCharacter?.charms) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      charms: currentCharacter.charms.map(charm =>
        charm.id === id ? { ...charm, [field]: value } : charm
      )
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteCharm = (id) => {
    if (!currentCharacter?.charms) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      charms: currentCharacter.charms.filter(charm => charm.id !== id)
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const addSpell = () => {
    if (!currentCharacter) return;
    
    const newSpell = {
      id: Date.now(),
      name: '',
      step: 1,
      cost: '',
      description: '',
      pageReference: ''
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      spells: [...(currentCharacter.spells || []), newSpell]
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateSpell = (id, field, value) => {
    if (!currentCharacter?.spells) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      spells: currentCharacter.spells.map(spell =>
        spell.id === id ? { ...spell, [field]: value } : spell
      )
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteSpell = (id) => {
    if (!currentCharacter?.spells) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      spells: currentCharacter.spells.filter(spell => spell.id !== id)
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };
  
  const updateDicePoolValue = (field, value) => {
    if (!currentCharacter?.dicePool) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      dicePool: {
        ...currentCharacter.dicePool,
        [field]: value
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const calculateDicePool = () => {
    if (!currentCharacter?.dicePool || !currentCharacter?.attributes || !currentCharacter?.abilities) {
      return { basePool: 0, extraDice: 0, totalPool: 0, cappedBonusDice: 0, actionPhrase: "Roll 0, TN 7 Double 10s" };
    }
    
    const { attribute, ability, targetNumber, doublesThreshold, extraSuccessBonus, extraSuccessNonBonus } = currentCharacter.dicePool;
    const attributeTotal = calculateTotal(currentCharacter.attributes[attribute] || { base: 0, added: 0, bonus: 0 });
    const abilityTotal = calculateTotal(currentCharacter.abilities[ability] || { base: 0, added: 0, bonus: 0 });
    const basePool = attributeTotal + abilityTotal;
    
    const { extraDiceBonus, extraDiceNonBonus } = currentCharacter.dicePool;
    const cappedBonusDice = Math.min(extraDiceBonus || 0, 10);
    const totalExtraDice = cappedBonusDice + (extraDiceNonBonus || 0);
    const totalPool = basePool + totalExtraDice;
    
    const totalExtraSuccess = (extraSuccessBonus || 0) + (extraSuccessNonBonus || 0);
    
    // Generate action phrase
    let actionPhrase = `Roll ${totalPool}`;
    if (totalExtraSuccess > 0) {
      actionPhrase += `, ${totalExtraSuccess} success in`;
    }
    actionPhrase += `, TN ${targetNumber}`;
    if (doublesThreshold < 10) {
      actionPhrase += ` Double ${doublesThreshold}s`;
    } else {
      actionPhrase += ` Double 10s`;
    }
    
    return {
      basePool,
      extraDice: totalExtraDice,
      totalPool,
      cappedBonusDice,
      actionPhrase
    };
  };

  // Combat calculations
  const calculateJoinBattle = () => {
    const bestAttr = getHighestAttribute();
    const closeCombat = calculateTotal(currentCharacter?.abilities?.closeCombat || { base: 0, added: 0, bonus: 0 });
    const rangedCombat = calculateTotal(currentCharacter?.abilities?.rangedCombat || { base: 0, added: 0, bonus: 0 });
    const bestCombat = Math.max(closeCombat, rangedCombat);
    const bonus = currentCharacter?.combat?.joinBattleBonus || 0;
    return bestAttr + bestCombat + bonus;
  };

  const updateCombatValue = (field, value) => {
    const numValue = parseInt(value) || 0;
    
    const updatedCharacter = {
      ...currentCharacter,
      combat: {
        ...currentCharacter.combat,
        [field]: numValue
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Social Management
  const setVirtue = (type, virtue) => {
    if (!currentCharacter) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      social: {
        ...currentCharacter.social,
        virtues: {
          ...currentCharacter.social?.virtues,
          [type]: virtue
        }
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const addIntimacy = (type = 'Tie') => {
    if (!currentCharacter) return;
    
    const newIntimacy = {
      id: Date.now(),
      intimacy: '',
      type: type,
      strength: 'Minor'
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      social: {
        ...currentCharacter.social,
        intimacies: [...(currentCharacter.social?.intimacies || []), newIntimacy]
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateIntimacy = (id, field, value) => {
    if (!currentCharacter) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      social: {
        ...currentCharacter.social,
        intimacies: (currentCharacter.social?.intimacies || []).map(intimacy =>
          intimacy.id === id ? { ...intimacy, [field]: value } : intimacy
        )
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteIntimacy = (id) => {
    if (!currentCharacter) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      social: {
        ...currentCharacter.social,
        intimacies: (currentCharacter.social?.intimacies || []).filter(intimacy => intimacy.id !== id)
      }
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Rulings Management
  const addRuling = () => {
    if (!currentCharacter) return;
    
    const newRuling = {
      id: Date.now(),
      text: '',
      date: new Date().toLocaleDateString()
    };
    
    const updatedCharacter = {
      ...currentCharacter,
      rulings: [...(currentCharacter.rulings || []), newRuling]
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const updateRuling = (id, text) => {
    if (!currentCharacter) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      rulings: (currentCharacter.rulings || []).map(ruling =>
        ruling.id === id ? { ...ruling, text } : ruling
      )
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  const deleteRuling = (id) => {
    if (!currentCharacter) return;
    
    const updatedCharacter = {
      ...currentCharacter,
      rulings: (currentCharacter.rulings || []).filter(ruling => ruling.id !== id)
    };
    
    setCurrentCharacter(updatedCharacter);
    setCharacters(prev => 
      prev.map(char => char.id === currentCharacter.id ? updatedCharacter : char)
    );
  };

  // Calculate ability total with selected attribute
  const calculateAbilityTotal = (abilityKey) => {
    const ability = currentCharacter?.abilities?.[abilityKey];
    if (!ability) return 0;
    
    const abilityTotal = calculateTotal(ability);
    
    if (!globalAbilityAttribute || globalAbilityAttribute === 'none') return abilityTotal;
    
    const attribute = currentCharacter?.attributes?.[globalAbilityAttribute];
    if (!attribute) return abilityTotal;
    
    return abilityTotal + calculateTotal(attribute);
  };

  if (showAbout) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={() => {
              setShowAbout(false);
              if (!currentCharacter) setShowCharacterSelect(true);
            }}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            ← Back
          </button>
          <div className="prose max-w-none">
            {renderMarkdown(aboutContent)}
          </div>
        </div>
      </div>
    );
  }

  if (showCharacterSelect || !currentCharacter) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Exalted: Essence Character Manager
          </h1>
          
          {/* Top Navigation */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowAbout(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              About
            </button>
          </div>
          
          {/* Import/Export Controls */}
          <div className="mb-6 flex justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload size={18} />
              Import Character(s)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importCharacter}
              className="hidden"
            />
            {characters.length > 0 && (
              <button
                onClick={exportAllCharacters}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                Export All Characters
              </button>
            )}
          </div>
          
          {/* Create New Character */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Character</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                placeholder="Character name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCharacter()}
              />
              <button
                onClick={handleCreateCharacter}
                disabled={!newCharacterName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Plus size={18} />
                Create
              </button>
            </div>
          </div>

          {/* Existing Characters */}
          {characters.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Character</h2>
              <div className="grid gap-3">
                {characters.map(character => (
                  <div 
                    key={character.id}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-gray-600" />
                      <span className="font-medium">{character.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectCharacter(character)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <Edit3 size={14} />
                        Select
                      </button>
                      <button
                        onClick={() => exportCharacter(character)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Download size={14} />
                        Export
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(character.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const StatRow = ({ label, stat, section, statKey }) => (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-3 font-medium text-gray-700">{label}</td>
      <td className="py-2 px-3">
        <input
          type="number"
          value={stat.base}
          onChange={(e) => updateCharacterValue(section, statKey, 'base', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          min={section === 'attributes' ? "1" : "0"}
          max="5"
        />
      </td>
      <td className="py-2 px-3">
        <input
          type="number"
          value={stat.added}
          onChange={(e) => {
            const maxAdded = Math.max(0, 5 - stat.base);
            const clampedValue = Math.min(maxAdded, Math.max(0, parseInt(e.target.value) || 0));
            updateCharacterValue(section, statKey, 'added', clampedValue);
          }}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="0"
          max={Math.max(0, 5 - stat.base)}
        />
      </td>
      <td className="py-2 px-3">
        <input
          type="number"
          value={stat.bonus}
          onChange={(e) => updateCharacterValue(section, statKey, 'bonus', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="0"
        />
      </td>
      <td className="py-2 px-3 font-bold text-blue-600 text-center">
        {calculateTotal(stat)}
      </td>
    </tr>
  );

  const AbilityRow = ({ label, stat, statKey }) => {
    return (
      <tr className="border-b border-gray-200">
        <td className="py-2 px-3 font-medium text-gray-700 text-sm">{label}</td>
        <td className="py-2 px-3">
          <input
            type="number"
            value={stat.base}
            onChange={(e) => updateCharacterValue('abilities', statKey, 'base', e.target.value)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0"
            max="5"
          />
        </td>
        <td className="py-2 px-3">
          <input
            type="number"
            value={stat.added}
            onChange={(e) => {
              const maxAdded = Math.max(0, 5 - stat.base);
              const clampedValue = Math.min(maxAdded, Math.max(0, parseInt(e.target.value) || 0));
              updateCharacterValue('abilities', statKey, 'added', clampedValue);
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0"
            max={Math.max(0, 5 - stat.base)}
          />
        </td>
        <td className="py-2 px-3">
          <input
            type="number"
            value={stat.bonus}
            onChange={(e) => updateCharacterValue('abilities', statKey, 'bonus', e.target.value)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="0"
          />
        </td>
        <td className="py-2 px-3 font-bold text-blue-600 text-center text-sm">
          {calculateAbilityTotal(statKey)}
        </td>
      </tr>
    );
  };

  const tabs = [
    { id: 'core', label: 'Core Stats', icon: User },
    { id: 'combat', label: 'Combat', icon: Swords },
    { id: 'equipment', label: 'Equipment', icon: Shield },
    { id: 'powers', label: 'Powers', icon: BookOpen },
    { id: 'socials', label: 'Socials', icon: Users },
    { id: 'advancement', label: 'Advancement', icon: TrendingUp },
    { id: 'rulings', label: 'Rulings', icon: Scroll },
    { id: 'wip', label: 'WIP', icon: Construction }
  ];

  const virtueOptions = ['Compassion', 'Courage', 'Discipline', 'Justice', 'Loyalty', 'Wonder'];

  const combatSteps = [
    { step: 1, defaultActions: ['Move', 'Decisive Attack', 'Withering Attack', 'Activate Excellence'] },
    { step: 2, defaultActions: [] },
    { step: 3, defaultActions: [] },
    { step: 4, defaultActions: [] },
    { step: 5, defaultActions: [] },
    { step: 6, defaultActions: [] },
    { step: 7, defaultActions: [] },
    { step: 8, defaultActions: [] }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{currentCharacter.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAbout(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              About
            </button>
            <button
              onClick={() => exportCharacter(currentCharacter)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => characterFileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Upload size={18} />
              Import
            </button>
            <input
              ref={characterFileInputRef}
              type="file"
              accept=".json"
              onChange={importCharacter}
              className="hidden"
            />
            <button
              onClick={() => setShowCharacterSelect(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <User size={18} />
              Switch Character
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-t-lg shadow-lg">
        <div className="flex flex-wrap border-b">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-lg p-6">
        {/* Core Stats Tab */}
        {activeTab === 'core' && (
          <div className="space-y-6">
            {/* Essence */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Essence</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Rating:</span>
                  <input
                    type="number"
                    value={currentCharacter.essence.rating}
                    onChange={(e) => updateEssenceValue('rating', e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-lg"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Motes</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.motes}
                      onChange={(e) => updateEssenceValue('motes', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Commitments</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.commitments}
                      onChange={(e) => updateEssenceValue('commitments', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Spent</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.spent}
                      onChange={(e) => updateEssenceValue('spent', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-blue-600">Remain</label>
                      <span className="font-bold text-blue-600">{calculateRemainEssence()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-green-600">Open</label>
                      <span className="font-bold text-green-600">{calculateOpenEssence()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Anima</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.anima}
                      onChange={(e) => updateEssenceValue('anima', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="10"
                    />
                  </div>
                  
                  {/* Anima Rulings */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-600">Anima Level</span>
                      <span className="font-bold text-purple-600">{getAnimaLevel(currentCharacter?.essence?.anima || 0)}</span>
                    </div>
                    {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).length > 0 && (
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-sm font-medium text-purple-700 mb-1">Active Effects:</div>
                        {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).map((ruling, index) => (
                          <div key={index} className="text-sm text-purple-600">• {ruling}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Attributes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Attributes</h2>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left">Attribute</th>
                      <th className="py-2 px-3 text-center">Base</th>
                      <th className="py-2 px-3 text-center">Added</th>
                      <th className="py-2 px-3 text-center">Bonus</th>
                      <th className="py-2 px-3 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <StatRow label="Fortitude" stat={currentCharacter.attributes.fortitude} section="attributes" statKey="fortitude" />
                    <StatRow label="Finesse" stat={currentCharacter.attributes.finesse} section="attributes" statKey="finesse" />
                    <StatRow label="Force" stat={currentCharacter.attributes.force} section="attributes" statKey="force" />
                  </tbody>
                </table>
                <div className="mt-2 text-xs text-gray-500 italic">
                  Note: Base + Added cannot exceed 5 for any attribute
                </div>
              </div>

              {/* Abilities */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Abilities</h2>
                
                {/* Global Attribute Selector */}
                <div className="mb-4 p-3 bg-white rounded border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Add Attribute to All Abilities:</div>
                  <div className="flex gap-2">
                    {['none', 'fortitude', 'finesse', 'force'].map(attr => (
                      <button
                        key={attr}
                        onClick={() => setGlobalAbilityAttribute(attr)}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                          globalAbilityAttribute === attr
                            ? attr === 'none' 
                              ? 'bg-gray-600 text-white'
                              : attr === 'fortitude'
                              ? 'bg-red-600 text-white'
                              : attr === 'finesse'
                              ? 'bg-blue-600 text-white'
                              : 'bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {attr === 'none' ? 'None' : attr.charAt(0).toUpperCase() + attr.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 text-left text-sm">Ability</th>
                        <th className="py-2 px-3 text-center text-sm">Base</th>
                        <th className="py-2 px-3 text-center text-sm">Added</th>
                        <th className="py-2 px-3 text-center text-sm">Bonus</th>
                        <th className="py-2 px-3 text-center text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AbilityRow label="Athletics" stat={currentCharacter.abilities.athletics} statKey="athletics" />
                      <AbilityRow label="Awareness" stat={currentCharacter.abilities.awareness} statKey="awareness" />
                      <AbilityRow label="Close Combat" stat={currentCharacter.abilities.closeCombat} statKey="closeCombat" />
                      <AbilityRow label="Craft" stat={currentCharacter.abilities.craft} statKey="craft" />
                      <AbilityRow label="Embassy" stat={currentCharacter.abilities.embassy} statKey="embassy" />
                      <AbilityRow label="Integrity" stat={currentCharacter.abilities.integrity} statKey="integrity" />
                      <AbilityRow label="Navigate" stat={currentCharacter.abilities.navigate} statKey="navigate" />
                      <AbilityRow label="Physique" stat={currentCharacter.abilities.physique} statKey="physique" />
                      <AbilityRow label="Presence" stat={currentCharacter.abilities.presence} statKey="presence" />
                      <AbilityRow label="Performance" stat={currentCharacter.abilities.performance} statKey="performance" />
                      <AbilityRow label="Ranged Combat" stat={currentCharacter.abilities.rangedCombat} statKey="rangedCombat" />
                      <AbilityRow label="Sagacity" stat={currentCharacter.abilities.sagacity} statKey="sagacity" />
                      <AbilityRow label="Stealth" stat={currentCharacter.abilities.stealth} statKey="stealth" />
                      <AbilityRow label="War" stat={currentCharacter.abilities.war} statKey="war" />
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-xs text-gray-500 italic">
                  Note: Base + Added cannot exceed 5 for any ability
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Combat Tab */}
        {activeTab === 'combat' && (
          <div className="space-y-6">
            {/* Essence */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Essence</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Rating:</span>
                  <input
                    type="number"
                    value={currentCharacter.essence.rating}
                    onChange={(e) => updateEssenceValue('rating', e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-lg"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Motes</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.motes}
                      onChange={(e) => updateEssenceValue('motes', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Commitments</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.commitments}
                      onChange={(e) => updateEssenceValue('commitments', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Spent</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.spent}
                      onChange={(e) => updateEssenceValue('spent', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-blue-600">Remain</label>
                      <span className="font-bold text-blue-600">{calculateRemainEssence()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-green-600">Open</label>
                      <span className="font-bold text-green-600">{calculateOpenEssence()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-gray-700">Anima</label>
                    <input
                      type="number"
                      value={currentCharacter.essence.anima}
                      onChange={(e) => updateEssenceValue('anima', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="10"
                    />
                  </div>
                  
                  {/* Anima Rulings */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-600">Anima Level</span>
                      <span className="font-bold text-purple-600">{getAnimaLevel(currentCharacter?.essence?.anima || 0)}</span>
                    </div>
                    {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).length > 0 && (
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-sm font-medium text-purple-700 mb-1">Active Effects:</div>
                        {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).map((ruling, index) => (
                          <div key={index} className="text-sm text-purple-600">• {ruling}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Rolls */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Combat Rolls</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Join Battle */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">Join Battle</h3>
                  <div className="p-3 bg-white rounded">
                    <div className="text-sm text-gray-600 mb-2">
                      Best Attribute + Best of Close/Ranged Combat + Bonus
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Bonus Modifier</span>
                      <input
                        type="number"
                        value={currentCharacter?.combat?.joinBattleBonus || 0}
                        onChange={(e) => updateCombatValue('joinBattleBonus', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-center p-2 bg-blue-100 rounded">
                      <div className="text-2xl font-bold text-blue-800">{calculateJoinBattle()}</div>
                      <div className="text-sm text-blue-600">Join Battle Pool</div>
                    </div>
                  </div>
                </div>

                {/* Power Tracker */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">Power Tracker</h3>
                  <div className="p-3 bg-white rounded">
                    <div className="text-sm text-gray-600 mb-2">
                      Track power gained from attacks
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => updateCombatValue('power', Math.max(0, (currentCharacter?.combat?.power || 0) - 1))}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        -
                      </button>
                      <div className="text-3xl font-bold text-gray-800 w-16 text-center">
                        {currentCharacter?.combat?.power || 0}
                      </div>
                      <button
                        onClick={() => updateCombatValue('power', (currentCharacter?.combat?.power || 0) + 1)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weapon Combat Roller */}
              {(currentCharacter?.weapons || []).length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Weapon Combat Rolls</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-3 text-left">Weapon</th>
                          <th className="py-2 px-3 text-center">Range</th>
                          <th className="py-2 px-3 text-center">Attack Pool</th>
                          <th className="py-2 px-3 text-center">Damage Pool</th>
                          <th className="py-2 px-3 text-center">Overwhelming</th>
                          <th className="py-2 px-3 text-center">Defense Bonus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentCharacter.weapons.map(weapon => {
                          const isClose = weapon.range === 'close';
                          const relevantAbility = isClose ? 'closeCombat' : 'rangedCombat';
                          const abilityTotal = calculateTotal(currentCharacter.abilities[relevantAbility] || { base: 0, added: 0, bonus: 0 });
                          const bestAttr = getHighestAttribute();
                          const attackPool = bestAttr + abilityTotal + (parseInt(weapon.accuracy) || 0);
                          const damagePool = parseInt(weapon.damage) || 0;
                          
                          return (
                            <tr key={weapon.id} className="border-b border-gray-200">
                              <td className="py-2 px-3 font-medium">{weapon.name || 'Unnamed Weapon'}</td>
                              <td className="py-2 px-3 text-center capitalize">{weapon.range || 'close'}</td>
                              <td className="py-2 px-3 text-center font-bold text-blue-600">{attackPool}</td>
                              <td className="py-2 px-3 text-center font-bold text-red-600">{damagePool}</td>
                              <td className="py-2 px-3 text-center">{weapon.overwhelming || 0}</td>
                              <td className="py-2 px-3 text-center">+{weapon.defence || 0}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Static Values */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Static Values</h2>
              <div className="space-y-4">
                {/* First Row */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Defense */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{calculateDefense()}</div>
                      <div className="text-sm font-medium text-gray-700">Defense</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>Max of Evasion/Parry</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-xs text-gray-600">Mod:</label>
                      <input
                        type="number"
                        value={currentCharacter?.staticValues?.defenseModifier || 0}
                        onChange={(e) => updateStaticValueModifier('defenseModifier', e.target.value)}
                        className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="-5"
                        max="5"
                      />
                    </div>
                  </div>

                  {/* Evasion */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{calculateEvasion()}</div>
                      <div className="text-sm font-medium text-gray-700">Evasion</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>⌈(Athletics + Max Attr) / 2⌉</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-xs text-gray-600">Mod:</label>
                      <input
                        type="number"
                        value={currentCharacter?.staticValues?.evasionModifier || 0}
                        onChange={(e) => updateStaticValueModifier('evasionModifier', e.target.value)}
                        className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="-5"
                        max="5"
                      />
                    </div>
                  </div>

                  {/* Parry */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{calculateParry()}</div>
                      <div className="text-sm font-medium text-gray-700">Parry</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>⌈(Close Combat + Max Attr) / 2⌉</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-xs text-gray-600">Mod:</label>
                      <input
                        type="number"
                        value={currentCharacter?.staticValues?.parryModifier || 0}
                        onChange={(e) => updateStaticValueModifier('parryModifier', e.target.value)}
                        className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="-5"
                        max="5"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Resolve */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{calculateResolve()}</div>
                      <div className="text-sm font-medium text-gray-700">Resolve</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>2 + Integrity bonuses</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-xs text-gray-600">Mod:</label>
                      <input
                        type="number"
                        value={currentCharacter?.staticValues?.resolveModifier || 0}
                        onChange={(e) => updateStaticValueModifier('resolveModifier', e.target.value)}
                        className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="-5"
                        max="5"
                      />
                    </div>
                  </div>

                  {/* Soak */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{calculateSoak()}</div>
                      <div className="text-sm font-medium text-gray-700">Soak</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>1 + Physique + Armor</div>
                      <div>Armor: +{getTotalArmorSoak()}</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-xs text-gray-600">Mod:</label>
                      <input
                        type="number"
                        value={currentCharacter?.staticValues?.soakModifier || 0}
                        onChange={(e) => updateStaticValueModifier('soakModifier', e.target.value)}
                        className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="-5"
                        max="5"
                      />
                    </div>
                  </div>

                  {/* Hardness */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{calculateHardness()}</div>
                      <div className="text-sm font-medium text-gray-700">Hardness</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>Essence + 2 + Armor</div>
                      <div>Armor: +{getTotalArmorHardness()}</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-xs text-gray-600">Mod:</label>
                      <input
                        type="number"
                        value={currentCharacter?.staticValues?.hardnessModifier || 0}
                        onChange={(e) => updateStaticValueModifier('hardnessModifier', e.target.value)}
                        className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="-5"
                        max="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Track */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Health Track</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Exalt Type:</span>
                    <select
                      value={currentCharacter?.health?.exaltType || 'lunar'}
                      onChange={(e) => updateHealthValue('exaltType', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="lunar">Lunar</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Ox Body:</span>
                    <input
                      type="number"
                      value={currentCharacter?.health?.oxBodyLevels || 0}
                      onChange={(e) => updateHealthValue('oxBodyLevels', Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="5"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 p-3 bg-white rounded">
                    <h3 className="font-semibold text-gray-700 mb-2">Health Levels</h3>
                    <div className="space-y-1 text-sm">
                      <div>0: <span className="font-bold">{calculateHealthLevels().zero}</span></div>
                      <div>-1: <span className="font-bold">{calculateHealthLevels().minusOne}</span></div>
                      <div>-2: <span className="font-bold">{calculateHealthLevels().minusTwo}</span></div>
                      <div>Incap</div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <div>Total: <span className="font-bold">{calculateHealthLevels().total}</span></div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-red-50 rounded">
                    <h3 className="font-semibold text-red-700 mb-2">Current Penalty</h3>
                    <div className="text-2xl font-bold text-red-600 text-center">
                      {calculateHealthPenalty() === -99 ? 'Incapacitated' : calculateHealthPenalty()}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded">
                    <h3 className="font-semibold text-gray-700 mb-2">Damage Taken</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600">Bashing</label>
                        <input
                          type="number"
                          value={currentCharacter?.health?.bashingDamage || 0}
                          onChange={(e) => updateHealthValue('bashingDamage', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600">Lethal</label>
                        <input
                          type="number"
                          value={currentCharacter?.health?.lethalDamage || 0}
                          onChange={(e) => updateHealthValue('lethalDamage', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600">Aggravated</label>
                        <input
                          type="number"
                          value={currentCharacter?.health?.aggravatedDamage || 0}
                          onChange={(e) => updateHealthValue('aggravatedDamage', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Dramatic Injuries</h3>
                      <button
                        onClick={addDramaticInjury}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add Injury
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {(currentCharacter?.health?.dramaticInjuries || []).map(injury => (
                        <div 
                          key={injury.id} 
                          className={`p-2 rounded border flex items-center gap-2 ${
                            injury.healed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <input
                            type="text"
                            value={injury.description}
                            onChange={(e) => updateDramaticInjury(injury.id, 'description', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Injury description..."
                          />
                          <button
                            onClick={() => toggleInjuryHealed(injury.id)}
                            className={`px-2 py-1 rounded text-xs ${
                              injury.healed 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {injury.healed ? 'Reopen' : 'Heal'}
                          </button>
                          <button
                            onClick={() => deleteDramaticInjury(injury.id)}
                            className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {(currentCharacter?.health?.dramaticInjuries || []).length === 0 && (
                        <p className="text-gray-500 italic text-sm">No dramatic injuries recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dice Pool Calculator */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dice Pool Calculator</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pool Assembly */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Pool Assembly</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Attribute</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateDicePoolValue('attribute', 'fortitude')}
                          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                            currentCharacter?.dicePool?.attribute === 'fortitude'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                          }`}
                        >
                          <div>Fortitude</div>
                          <div className="text-xs opacity-75">
                            ({calculateTotal(currentCharacter?.attributes?.fortitude || { base: 0, added: 0, bonus: 0 })})
                          </div>
                        </button>
                        <button
                          onClick={() => updateDicePoolValue('attribute', 'finesse')}
                          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                            currentCharacter?.dicePool?.attribute === 'finesse'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                          }`}
                        >
                          <div>Finesse</div>
                          <div className="text-xs opacity-75">
                            ({calculateTotal(currentCharacter?.attributes?.finesse || { base: 0, added: 0, bonus: 0 })})
                          </div>
                        </button>
                        <button
                          onClick={() => updateDicePoolValue('attribute', 'force')}
                          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                            currentCharacter?.dicePool?.attribute === 'force'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          <div>Force</div>
                          <div className="text-xs opacity-75">
                            ({calculateTotal(currentCharacter?.attributes?.force || { base: 0, added: 0, bonus: 0 })})
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Ability</label>
                      <select
                        value={currentCharacter?.dicePool?.ability || 'athletics'}
                        onChange={(e) => updateDicePoolValue('ability', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {Object.keys(currentCharacter?.abilities || {}).map(ability => (
                          <option key={ability} value={ability}>
                            {ability.charAt(0).toUpperCase() + ability.slice(1).replace(/([A-Z])/g, ' $1')} ({calculateTotal(currentCharacter?.abilities?.[ability] || { base: 0, added: 0, bonus: 0 })})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Target Number</label>
                        <input
                          type="number"
                          value={currentCharacter?.dicePool?.targetNumber || 7}
                          onChange={(e) => updateDicePoolValue('targetNumber', parseInt(e.target.value) || 7)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="1"
                          max="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Doubles Threshold</label>
                        <input
                          type="number"
                          value={currentCharacter?.dicePool?.doublesThreshold || 10}
                          onChange={(e) => updateDicePoolValue('doublesThreshold', parseInt(e.target.value) || 10)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Extra Dice and Success */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Extra Dice (Bonus)</label>
                        <input
                          type="number"
                          value={currentCharacter?.dicePool?.extraDiceBonus || 0}
                          onChange={(e) => updateDicePoolValue('extraDiceBonus', Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          max="10"
                        />
                        <div className="text-xs text-gray-500 mt-1">Max: 10</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Extra Dice (Non-Bonus)</label>
                        <input
                          type="number"
                          value={currentCharacter?.dicePool?.extraDiceNonBonus || 0}
                          onChange={(e) => updateDicePoolValue('extraDiceNonBonus', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Extra Success (Bonus)</label>
                        <input
                          type="number"
                          value={currentCharacter?.dicePool?.extraSuccessBonus || 0}
                          onChange={(e) => updateDicePoolValue('extraSuccessBonus', Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          max="5"
                        />
                        <div className="text-xs text-gray-500 mt-1">Max: 5</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Extra Success (Non-Bonus)</label>
                        <input
                          type="number"
                          value={currentCharacter?.dicePool?.extraSuccessNonBonus || 0}
                          onChange={(e) => updateDicePoolValue('extraSuccessNonBonus', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Results */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Dice Pool Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-blue-600 font-medium">Base Pool</div>
                    <div className="text-lg font-bold text-blue-800">{calculateDicePool().basePool}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Extra Dice</div>
                    <div className="text-lg font-bold text-blue-800">+{calculateDicePool().extraDice}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Total Dice</div>
                    <div className="text-lg font-bold text-blue-800">{calculateDicePool().totalPool}</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Extra Success</div>
                    <div className="text-lg font-bold text-blue-800">+{(currentCharacter?.dicePool?.extraSuccessBonus || 0) + (currentCharacter?.dicePool?.extraSuccessNonBonus || 0)}</div>
                  </div>
                </div>
                <div className="text-center p-2 bg-blue-100 rounded font-medium text-blue-800">
                  {calculateDicePool().actionPhrase}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            {/* Armor */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Armor</h2>
                <button
                  onClick={addArmor}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Armor
                </button>
              </div>
              
              {(currentCharacter?.armor || []).length === 0 ? (
                <p className="text-gray-500 italic">No armor equipped.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Name</th>
                        <th className="py-2 px-3 text-center">Type</th>
                        <th className="py-2 px-3 text-center">Soak</th>
                        <th className="py-2 px-3 text-center">Hardness</th>
                        <th className="py-2 px-3 text-center">Mobility</th>
                        <th className="py-2 px-3 text-left">Tags</th>
                        <th className="py-2 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentCharacter?.armor || []).map(armor => (
                        <tr key={armor.id} className="border-b border-gray-200">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={armor.name}
                              onChange={(e) => updateArmor(armor.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                              placeholder="Armor name..."
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={armor.type}
                              onChange={(e) => updateArmor(armor.id, 'type', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                            >
                              <option value="light">Light</option>
                              <option value="heavy">Heavy</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={armor.soak}
                              onChange={(e) => updateArmor(armor.id, 'soak', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-gray-500"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={armor.hardness}
                              onChange={(e) => updateArmor(armor.id, 'hardness', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-gray-500"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={armor.mobility}
                              onChange={(e) => updateArmor(armor.id, 'mobility', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={armor.tags}
                              onChange={(e) => updateArmor(armor.id, 'tags', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                              placeholder="Tags..."
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => deleteArmor(armor.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Weapons */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Weapons</h2>
                <button
                  onClick={addWeapon}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Weapon
                </button>
              </div>
              
              {(currentCharacter?.weapons || []).length === 0 ? (
                <p className="text-gray-500 italic">No weapons equipped.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Name</th>
                        <th className="py-2 px-3 text-center">Accuracy</th>
                        <th className="py-2 px-3 text-center">Damage</th>
                        <th className="py-2 px-3 text-center">Defence</th>
                        <th className="py-2 px-3 text-center">Overwhelming</th>
                        <th className="py-2 px-3 text-center">Range</th>
                        <th className="py-2 px-3 text-left">Tags</th>
                        <th className="py-2 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentCharacter?.weapons || []).map(weapon => (
                        <tr key={weapon.id} className="border-b border-gray-200">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={weapon.name}
                              onChange={(e) => updateWeapon(weapon.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Weapon name..."
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={weapon.accuracy}
                              onChange={(e) => updateWeapon(weapon.id, 'accuracy', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={weapon.damage}
                              onChange={(e) => updateWeapon(weapon.id, 'damage', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={weapon.defence}
                              onChange={(e) => updateWeapon(weapon.id, 'defence', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={weapon.overwhelming}
                              onChange={(e) => updateWeapon(weapon.id, 'overwhelming', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={weapon.range}
                              onChange={(e) => updateWeapon(weapon.id, 'range', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                            >
                              <option value="close">Close</option>
                              <option value="short">Short</option>
                              <option value="mid">Mid</option>
                              <option value="long">Long</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={weapon.tags}
                              onChange={(e) => updateWeapon(weapon.id, 'tags', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Tags..."
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => deleteWeapon(weapon.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* References */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tag References</h2>
              <div className="space-y-2">
                {(() => {
                  const allTags = new Set();
                  [...(currentCharacter?.armor || []), ...(currentCharacter?.weapons || [])]
                    .forEach(item => {
                      if (item.tags) {
                        item.tags.split(',').forEach(tag => {
                          const trimmed = tag.trim();
                          if (trimmed) allTags.add(trimmed);
                        });
                      }
                    });
                  
                  return Array.from(allTags).length > 0 ? (
                    Array.from(allTags).sort().map((tag, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-gray-200">
                        <span className="font-medium text-gray-700">{String(tag)}:</span>
                        <span className="text-gray-600 ml-2">(Placeholder reference)</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No tags to reference.</p>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Powers Tab */}
        {activeTab === 'powers' && (
          <div className="space-y-6">
            {/* Charms */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Charms</h2>
                <button
                  onClick={addCharm}
                  className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Charm
                </button>
              </div>
              
              {(currentCharacter?.charms || []).length === 0 ? (
                <p className="text-gray-500 italic">No charms yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Name</th>
                        <th className="py-2 px-3 text-center">Step</th>
                        <th className="py-2 px-3 text-center">Cost</th>
                        <th className="py-2 px-3 text-left">Description</th>
                        <th className="py-2 px-3 text-center">Page</th>
                        <th className="py-2 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentCharacter?.charms || []).map(charm => (
                        <tr key={charm.id} className="border-b border-gray-200">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={charm.name}
                              onChange={(e) => updateCharm(charm.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder="Charm name..."
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={charm.step}
                              onChange={(e) => updateCharm(charm.id, 'step', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              <option value="none">None</option>
                              {[1,2,3,4,5,6,7,8].map(step => (
                                <option key={step} value={step}>{step}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={charm.cost}
                              onChange={(e) => updateCharm(charm.id, 'cost', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder="Cost..."
                            />
                          </td>
                          <td className="py-2 px-3">
                            <textarea
                              value={charm.description}
                              onChange={(e) => updateCharm(charm.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                              placeholder="Description..."
                              rows={2}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={charm.pageReference || ''}
                              onChange={(e) => updateCharm(charm.id, 'pageReference', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder="p.XX"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => deleteCharm(charm.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Spells */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Spells</h2>
                <button
                  onClick={addSpell}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Spell
                </button>
              </div>
              
              {(currentCharacter?.spells || []).length === 0 ? (
                <p className="text-gray-500 italic">No spells yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Name</th>
                        <th className="py-2 px-3 text-center">Step</th>
                        <th className="py-2 px-3 text-center">Cost</th>
                        <th className="py-2 px-3 text-left">Description</th>
                        <th className="py-2 px-3 text-center">Page</th>
                        <th className="py-2 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentCharacter?.spells || []).map(spell => (
                        <tr key={spell.id} className="border-b border-gray-200">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={spell.name}
                              onChange={(e) => updateSpell(spell.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Spell name..."
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={spell.step}
                              onChange={(e) => updateSpell(spell.id, 'step', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="none">None</option>
                              {[1,2,3,4,5,6,7,8].map(step => (
                                <option key={step} value={step}>{step}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={spell.cost}
                              onChange={(e) => updateSpell(spell.id, 'cost', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Cost..."
                            />
                          </td>
                          <td className="py-2 px-3">
                            <textarea
                              value={spell.description}
                              onChange={(e) => updateSpell(spell.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                              placeholder="Description..."
                              rows={2}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={spell.pageReference || ''}
                              onChange={(e) => updateSpell(spell.id, 'pageReference', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="p.XX"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => deleteSpell(spell.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Socials Tab */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            {/* Social Influence Reference */}
            <div className="bg-blue-50 rounded-lg p-4 text-xs text-blue-700">
              <div className="font-semibold mb-1">Social Influence Steps:</div>
              <div>Step 1: The player declares her intention for the influence.</div>
              <div>Step 2: Form the dice pool for the action using an appropriate Attribute + Ability and adding any modifiers.</div>
              <div>Step 3: The target determines if any Virtues or Intimacies adjust his Resolve.</div>
              <div>Step 4: On success, the player utilizes extra successes to determine the extent of her influence action on the target. The target may choose to resist the social influence.</div>
              <div className="mt-2 font-semibold">Resolve Modifiers: Minor = ±2, Major = ±3. Minimum Resolve against social action = 1.</div>
            </div>

            {/* Resolve Display */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{calculateResolve()}</div>
                <div className="text-lg font-medium text-gray-700">Base Resolve</div>
                <div className="text-sm text-gray-500 mt-1">Before Virtue/Intimacy modifiers</div>
              </div>
            </div>

            {/* Virtues */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Virtues</h2>
              
              {/* Major Virtue */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Major Virtue</h3>
                <div className="grid grid-cols-3 gap-3">
                  {virtueOptions.map(virtue => {
                    const isSelected = currentCharacter?.social?.virtues?.major === virtue;
                    const isMinor = currentCharacter?.social?.virtues?.minor === virtue;
                    
                    return (
                      <button
                        key={virtue}
                        onClick={() => !isMinor && setVirtue('major', isSelected ? null : virtue)}
                        disabled={isMinor}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : isMinor
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {virtue}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minor Virtue */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Minor Virtue</h3>
                <div className="grid grid-cols-3 gap-3">
                  {virtueOptions.map(virtue => {
                    const isSelected = currentCharacter?.social?.virtues?.minor === virtue;
                    const isMajor = currentCharacter?.social?.virtues?.major === virtue;
                    
                    return (
                      <button
                        key={virtue}
                        onClick={() => !isMajor && setVirtue('minor', isSelected ? null : virtue)}
                        disabled={isMajor}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : isMajor
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {virtue}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Intimacies */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Intimacies</h2>
              
              {/* Ties */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Ties</h3>
                  <button
                    onClick={() => addIntimacy('Tie')}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1 text-sm"
                  >
                    <Plus size={14} />
                    Add Tie
                  </button>
                </div>
                
                {(currentCharacter?.social?.intimacies || []).filter(i => i.type === 'Tie').length === 0 ? (
                  <p className="text-gray-500 italic text-sm">No ties yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(currentCharacter?.social?.intimacies || [])
                      .filter(i => i.type === 'Tie')
                      .map(intimacy => (
                        <div key={intimacy.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={intimacy.intimacy}
                            onChange={(e) => updateIntimacy(intimacy.id, 'intimacy', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Tie description..."
                          />
                          <select
                            value={intimacy.strength}
                            onChange={(e) => updateIntimacy(intimacy.id, 'strength', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Minor">Minor</option>
                            <option value="Major">Major</option>
                          </select>
                          <button
                            onClick={() => deleteIntimacy(intimacy.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Principles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Principles</h3>
                  <button
                    onClick={() => addIntimacy('Principle')}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1 text-sm"
                  >
                    <Plus size={14} />
                    Add Principle
                  </button>
                </div>
                
                {(currentCharacter?.social?.intimacies || []).filter(i => i.type === 'Principle').length === 0 ? (
                  <p className="text-gray-500 italic text-sm">No principles yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(currentCharacter?.social?.intimacies || [])
                      .filter(i => i.type === 'Principle')
                      .map(intimacy => (
                        <div key={intimacy.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={intimacy.intimacy}
                            onChange={(e) => updateIntimacy(intimacy.id, 'intimacy', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Principle description..."
                          />
                          <select
                            value={intimacy.strength}
                            onChange={(e) => updateIntimacy(intimacy.id, 'strength', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Minor">Minor</option>
                            <option value="Major">Major</option>
                          </select>
                          <button
                            onClick={() => deleteIntimacy(intimacy.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Advancement Tab */}
        {activeTab === 'advancement' && (
          <div className="space-y-6">
            {/* Milestone Budget */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Milestone Budget</h2>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-left">Type</th>
                    <th className="py-2 px-3 text-center">Personal</th>
                    <th className="py-2 px-3 text-center">Exalt</th>
                    <th className="py-2 px-3 text-center">Minor</th>
                    <th className="py-2 px-3 text-center">Major</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 font-medium">Accrued</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={currentCharacter?.milestones?.personal || 0}
                        onChange={(e) => updateMilestone('personal', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={currentCharacter?.milestones?.exalt || 0}
                        onChange={(e) => updateMilestone('exalt', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
                        min="0"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={currentCharacter?.milestones?.minor || 0}
                        onChange={(e) => updateMilestone('minor', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                        min="0"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={currentCharacter?.milestones?.major || 0}
                        onChange={(e) => updateMilestone('major', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                        min="0"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 font-medium">Spent</td>
                    <td className="py-2 px-3 text-center font-bold text-blue-600">
                      {countAdvancementsByStatus().personal}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-purple-600">
                      {countAdvancementsByStatus().exalt}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-green-600">
                      {countAdvancementsByStatus().minor}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-red-600">
                      {countAdvancementsByStatus().major}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Remaining</td>
                    <td className="py-2 px-3 text-center font-bold">
                      {(currentCharacter?.milestones?.personal || 0) - countAdvancementsByStatus().personal}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      {(currentCharacter?.milestones?.exalt || 0) - countAdvancementsByStatus().exalt}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      {(currentCharacter?.milestones?.minor || 0) - countAdvancementsByStatus().minor}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      {(currentCharacter?.milestones?.major || 0) - countAdvancementsByStatus().major}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2 text-sm text-gray-600">
                Planned Advancements: <span className="font-bold">{countAdvancementsByStatus().planned}</span>
              </div>
            </div>
            
            {/* Advancement Log */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowAdvancementLog(!showAdvancementLog)}
                  className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-900"
                >
                  {showAdvancementLog ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  Advancement Log ({(currentCharacter?.advancement || []).length} entries)
                </button>
                <button
                  onClick={addAdvancementEntry}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Entry
                </button>
              </div>
              
              {showAdvancementLog && (
                <div>
                  {(currentCharacter?.advancement || []).length === 0 ? (
                    <p className="text-gray-500 italic">No advancement entries yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Item</th>
                            <th className="py-2 px-3 text-center">Status</th>
                            <th className="py-2 px-3 text-center">Date</th>
                            <th className="py-2 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentCharacter?.advancement || []).map(entry => (
                            <tr key={entry.id} className="border-b border-gray-200">
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={entry.item}
                                  onChange={(e) => updateAdvancementEntry(entry.id, 'item', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="Advancement item..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <select
                                  value={entry.status}
                                  onChange={(e) => updateAdvancementEntry(entry.id, 'status', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="Planned">Planned</option>
                                  <option value="Paid with Personal">Paid with Personal</option>
                                  <option value="Paid with Exalt">Paid with Exalt</option>
                                  <option value="Paid with Minor">Paid with Minor</option>
                                  <option value="Initial">Initial</option>
                                  <option value="Paid with Major">Paid with Major</option>
                                </select>
                              </td>
                              <td className="py-2 px-3 text-center text-sm text-gray-600">
                                {entry.timestamp}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => deleteAdvancementEntry(entry.id)}
                                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rulings Tab */}
        {activeTab === 'rulings' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Character-Specific Rulings</h2>
                <button
                  onClick={addRuling}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Ruling
                </button>
              </div>
              
              {(currentCharacter?.rulings || []).length === 0 ? (
                <p className="text-gray-500 italic">No rulings recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {(currentCharacter?.rulings || []).map(ruling => (
                    <div key={ruling.id} className="flex items-start gap-2 p-3 bg-white rounded border border-gray-200">
                      <textarea
                        value={ruling.text}
                        onChange={(e) => updateRuling(ruling.id, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                        placeholder="Enter ruling text..."
                        rows={2}
                      />
                      <div className="text-xs text-gray-500 whitespace-nowrap pt-1">
                        {ruling.date}
                      </div>
                      <button
                        onClick={() => deleteRuling(ruling.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WIP Tab */}
        {activeTab === 'wip' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
              <div className="font-semibold mb-1">Work In Progress</div>
              <div>This tab contains experimental features that are still being developed.</div>
            </div>

            {/* Combat Steps Guide */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Combat Turn Steps</h2>
              <div className="space-y-3">
                {combatSteps.map(step => (
                  <div key={step.step} className="p-3 bg-white rounded border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">Step {step.step}</h3>
                    <div className="space-y-1">
                      {step.defaultActions.map((action, index) => (
                        <div key={index} className="text-sm text-gray-600">• {action}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Note: This component will eventually allow dynamic addition of available actions per step based on character abilities and current combat situation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaltedCharacterManager;