# Workflow du Module Tracking (Suivi GPS)

Le module de Tracking permet aux managers et administrateurs de suivre en temps réel la position des agents sur le terrain pour des raisons de sécurité et d'optimisation des tournées.

## 1. Connexion WebSocket
- L'application mobile de l'agent se connecte au serveur WebSocket (Socket.io) avec son Token JWT.
- Le serveur authentifie la connexion (erreur `TRACKING_001` si échec) et place l'agent dans une "Room" correspondant à son `institutionId` (ou `agencyId`).

## 2. Transmission des Coordonnées
- L'application mobile émet un événement `agent:location:update` toutes les X minutes (configurable, ex: 5 minutes) contenant `latitude`, `longitude`, et `batteryLevel`.
> **Note sur la configuration** : La fréquence de tracking est définie de manière globale pour l'institution et est distribuée aux applications mobiles via Firebase Remote Config, afin de ne pas surcharger la base de données de réglages individuels.
- Le serveur intercepte l'événement, diffuse la position aux managers abonnés, et sauvegarde la coordonnée dans l'historique (`AgentLocationHistory`).

## 3. Consultation (Supervision)
- Les managers se connectent au WebSocket pour écouter les événements de leur agence et voir les points bouger sur une carte.
- Une API REST `GET /tracking/agents/:id/history` permet de reconstituer la tournée d'un agent pour une journée donnée.
- Si un agent reste inactif trop longtemps sur le terrain, le système peut déclencher un événement vers le module `Alert`.
