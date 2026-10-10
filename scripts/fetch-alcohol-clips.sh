#!/bin/bash
# Re-download the 16 Higgsfield clips (Kling 3.0 Pro) used by the AlcoholExplainer
# composition into public/explainer/alcohol/clips/ (they are git-ignored: ~105 MB).
set -e
cd "$(dirname "$0")/../public/explainer/alcohol" && mkdir -p clips
B=https://d8j0ntlcm91z4.cloudfront.net/user_3J3hbYed2NRlrQrOO10Q81fg9E5/hf_20261010_
while read n id; do curl -sSf -o "clips/$n.mp4" "$B$id.mp4" && echo "clips/$n.mp4"; done <<'LIST'
01 181139_dfb8a290-360a-469d-a5ae-9e43a2d6babb
02 181139_0b0707b7-945d-45ed-a9ab-2b1c76ba239d
03 181157_33655b0f-6748-4212-b713-cf92590c2990
04 181139_b9c1464a-3f3b-40b6-872e-160895a64f4b
05 181139_0007e873-5d16-429b-a733-77f8bd67809e
06 181157_81cb71f9-f76a-4fba-9e51-dc4fbca422db
07 181139_f58d8201-9e69-4548-8e87-f536b030968b
08 181139_dfcb8d06-469f-4c5b-802b-34fa62d7c0f6
09 181157_41d8b58f-31d9-43e5-9dbf-191d42d919fb
10 181139_3cabe0db-7af4-4a44-b518-facc2fffa69f
11 181139_906dec6e-24e2-4ab6-a5df-e644ad51391e
12 181157_9b927412-981e-4bd4-ba3d-dfeb05c22b71
13 181142_53ff63fa-c181-4f14-bd00-70ce44979a84
14 181157_f8b8d7fc-2d35-4bc4-9c8e-9fc9016e1322
15 181157_b9bf132c-5f31-4458-b68b-56e5be877269
16 181142_1f5e3727-74c4-42b2-81ea-eb3d0e64c919
LIST
