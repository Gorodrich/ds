---
layout: doc
permalink: /docs/territory/
tab: territory
order: 0
title: 個人開発領の申請
icon: map-pin
description: 画像タイル配布の申請可能領域画像を編集し、運営botの `/kaihatsu set` で個人開発領を届け出る方法。GIMP・Photopeaの両方に対応。
index_cards: chapters
quicknav:
  - title: 審査に必須の形式要件を確認したい
    url: /docs/territory/requirements/
    icon: warning-octagon
  - title: 画像のダウンロード手順
    url: /docs/territory/download/
    icon: download-simple
  - title: GIMPで編集する
    url: /docs/territory/gimp/
    icon: paint-brush
  - title: Photopeaで編集する
    url: /docs/territory/photopea/
    icon: browser
  - title: "`/kaihatsu set` で提出する"
    url: /docs/territory/submit/
    icon: discord-logo
  - title: 提出前のセルフチェック
    url: /docs/territory/checklist/
    icon: list-checks
---

旧ボーダー外に個人開発領を初めて届け出る人のためのタブです。[画像タイル配布](/tiles/)からダウンロードした「申請可能領域画像」を編集して、**自分が申請したい範囲だけを白で残し、それ以外をすべて透明にした画像**を作り、運営bot（OpsBot。Discord上の表示名は「DSクラフト運営bot」）の `/kaihatsu set` で届け出るまでを説明します。

## 届け出るまでの流れ

1. `/authorise` で、DiscordのアカウントとMinecraftのアカウントを紐づける（[アカウントの紐づけ](/docs/opsbot/authorise/)）。紐づけが済んでいないと `/kaihatsu set` は使えません
2. 届け出る画像の条件を確かめる（[1章「必ず確認する条件」](/docs/territory/requirements/)）。たとえば面積は、全部の画像の合計で25万平方ブロックまでです。超えた画像は運営botに却下されるので、超えるときは範囲を減らしてから届け出ます
3. 申請可能領域画像をダウンロードする（[2章「画像のダウンロード」](/docs/territory/download/)）
4. GIMPかPhotopeaで、申請したい範囲だけを白で残す（[3章「GIMPで編集する」](/docs/territory/gimp/)・[4章「Photopeaで編集する」](/docs/territory/photopea/)）
5. 提出前のセルフチェックをする（[6章「提出前のセルフチェック」](/docs/territory/checklist/)）
6. `/kaihatsu set` で画像を送り、結果を確かめる（[5章「`/kaihatsu set` で提出する」](/docs/territory/submit/)）
{: .steps}

編集ソフトは **GIMP**（インストールして使うソフト）と **Photopea**（インストール不要・ブラウザだけで使えるソフト）の2種類に対応しています。どちらか使いやすい方を1つだけ選んで作業してください。Photoshopなど他のソフトを使っても構いませんが、その場合も[1章の条件](/docs/territory/requirements/)は必ず守ってください。

> GIMPやPhotopeaの操作にすでに慣れている人は、3章・4章の手順は読み飛ばして構いません。ただし**[1章「必ず確認する条件」](/docs/territory/requirements/)だけは全員必ず確認してください**。条件を満たしていない画像は、運営botに却下されます。
{: .callout .warn}

## ほかのページとの分担

個人開発領の説明は、3か所に分かれています。

| ページ | 書いてあること |
|---|---|
| [旧ボーダー外で開発したいときは（個人開発領）](/docs/life/personal-dev/) | 制度とルール（個人開発領で何ができるか、要件、重なったときの扱い、譲渡） |
| このタブ | 初めての届出の手順（画像を作る → `/kaihatsu set` で送る → 結果を見る） |
| [運営botの個人開発領の章](/docs/opsbot/kaihatsu/) | `/kaihatsu` のコマンドの全部（範囲の変更・全部やめる・譲る・まとめての届出・登録の確認・承認の撤回） |
