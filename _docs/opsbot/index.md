---
layout: doc
permalink: /docs/opsbot/
tab: opsbot
order: 0
title: 運営bot
icon: robot
description: 運営bot（OpsBot）でできることと、自分に関係する章の見つけ方。botは手続きの受付・集計・通知・記録を代わりに行います。
index_cards: chapters
quicknav:
  - title: 参加したら最初にやること（アカウントの紐づけ）
    url: /docs/opsbot/authorise/
    icon: link
  - title: 個人開発領を届け出る・変える・譲る
    url: /docs/opsbot/kaihatsu/
    icon: map-pin
  - title: 参加者投票に投票する
    url: /docs/opsbot/vote/
    icon: check-square
  - title: 海を埋め立てたい（護岸工事も）
    url: /docs/opsbot/umetate/
    icon: waves
  - title: 運営はbotでどう仕事しているのか
    url: /docs/opsbot/modvote/
    icon: users-three
---

ディスコード鯖（Discordサーバー「3DS半分こするくらい仲良しクラフト中央委員会」）にいる運営bot（OpsBot。Discord上の表示名は「DSクラフト運営bot」）の使い方をまとめたタブです。参加者が使うコマンドと、運営者が使うコマンドの両方を載せています。

## 運営botとは

運営botは、運営の仕事のうち、ルールで決まった手続きの受付・集計・通知・記録を代わりに行うDiscordのbotです。コマンドは、Discordの入力欄に `/` を打つと候補が出ます。

- **参加者が自分で行う手続き**：アカウントの紐づけ、個人開発領の届出、参加者投票への投票、海の埋立ての許可の請求は、チケットではなく運営botのコマンドやボタンで行います。
- **判断するのは人**：参加者投票・運営投票の賛成・反対や、海の埋立ての許可は、参加者や運営者がボタンで決めます。運営botは票を数えて結果を知らせます。
- **個人開発領の審査**：運営botが、面積・重なり・画像の形式など機械的に判定できる条件をその場で確かめ、承認・却下・保留のどれかの結果を出します。運営botの承認は、運営者があとから撤回して改めて審査できます（[個人開発領の届出](/docs/opsbot/kaihatsu/)）。

このタブの説明は、ルールの条文に沿って書いています。運営botの表示とルールの条文が食い違って見えるときは、チケットで運営に確かめてください（[困ったときは](/docs/life/help/)）。

## 自分に関係する章

参加者が使うのは1〜4章です。5〜7章は運営者だけが使うコマンドの章ですが、運営がbotでどのように仕事をしているかを知りたい参加者も読めるように書いています。

| 章 | 主なコマンド | 対象 |
|---|---|---|
| [アカウントの紐づけ](/docs/opsbot/authorise/) | `/authorise`・`/whoami` | 参加者・仮参加者（最初に1回）。`/modauth` は運営者だけ |
| [個人開発領の届出](/docs/opsbot/kaihatsu/) | `/kaihatsu` | 個人開発領を持つ・作る参加者。承認の撤回は運営者だけ |
| [参加者投票](/docs/opsbot/vote/) | 投票のボタン・`/vote status` | 参加者（仮参加者は投票できません）。投票を始めるのは運営者だけ |
| [海の埋立ての許可](/docs/opsbot/umetate/) | `/umetate` | 誰でも要請できます。許可するのは運営者だけ |
| [運営の承認](/docs/opsbot/modvote/) | `/modvote`・`/kyoka` | 運営者だけ |
| [運営の仕事の管理](/docs/opsbot/task/) | `/task`・`/staff leave`・`/subaccount` | 運営者だけ |
| [障害のお知らせとbotの管理](/docs/opsbot/shogai/) | `/shogai`・`/ops` | 運営者だけ。参加者向けにお知らせの読み方も載せています |

参加者・仮参加者になったら、まず[アカウントの紐づけ](/docs/opsbot/authorise/)をしてください。紐づけが済んでいないと、マイクラ鯖に入れず、個人開発領の届出もできません。

個人開発領を初めて届け出る人は、画像の作り方から順に説明している[個人開発領の申請](/docs/territory/)のタブから読んでください。ルールそのもの（何ができるか、してはいけないこと）は[生活ガイド](/docs/life/)にあります。

> **注意書き**
> 本ガイドは参加者の理解を助けるための参考資料であり、条文の要約・簡略化を含みます。個別具体的な事案における最終的なルール運用・処分判断は、サーバー運営および裁判所等の正式な判断に委ねられます。正確な内容は必ず各ルール原文をご確認ください。
{: .callout .notice}
