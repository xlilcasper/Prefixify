/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import { definePluginSettings } from "@api/Settings";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { React, useEffect, useState } from "@webpack/common";

const logger = new Logger("PluginManager", "#a6d189");

let lastState = 0;
const states = [
    {
        prefix: "",
        svg: () => (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ scale: "1.2" }}
            >
                <path fill="currentColor" mask="url(#vc-prefix-msg-mask)" d="M15 20.47H6.08C5.17469 20.4673 4.30737 20.1059 3.66815 19.4648C3.02894 18.8237 2.66999 17.9553 2.67 17.05V8.15999C2.66999 7.25468 3.02894 6.3863 3.66815 5.74521C4.30737 5.10413 5.17469 4.74264 6.08 4.73999H8.75C8.94891 4.73999 9.13968 4.81901 9.28033 4.95966C9.42098 5.10031 9.5 5.29108 9.5 5.48999C9.5 5.6889 9.42098 5.87967 9.28033 6.02032C9.13968 6.16097 8.94891 6.23999 8.75 6.23999H6.08C5.57252 6.24263 5.08672 6.44608 4.72881 6.80587C4.3709 7.16565 4.16999 7.6525 4.17 8.15999V17.05C4.16603 17.3038 4.21243 17.5559 4.30651 17.7916C4.4006 18.0274 4.5405 18.2422 4.71812 18.4235C4.89575 18.6049 5.10757 18.7492 5.34133 18.8481C5.57509 18.9471 5.82616 18.9987 6.08 19H15C15.2521 19 15.5018 18.9503 15.7348 18.8538C15.9677 18.7574 16.1794 18.6159 16.3576 18.4376C16.5359 18.2593 16.6774 18.0477 16.7738 17.8147C16.8703 17.5818 16.92 17.3321 16.92 17.08V15.27C16.92 15.0711 16.999 14.8803 17.1397 14.7397C17.2803 14.599 17.4711 14.52 17.67 14.52C17.8689 14.52 18.0597 14.599 18.2003 14.7397C18.341 14.8803 18.42 15.0711 18.42 15.27V17.05C18.42 17.4991 18.3315 17.9438 18.1597 18.3588C17.9878 18.7737 17.7359 19.1507 17.4183 19.4683C17.1007 19.7859 16.7237 20.0378 16.3088 20.2097C15.8938 20.3815 15.4491 20.47 15 20.47Z M17.63 8.76999C17.4369 8.76772 17.2519 8.69203 17.1126 8.5583C16.9733 8.42457 16.8901 8.24283 16.88 8.04999C16.8649 7.74758 16.7771 7.45328 16.6239 7.19212C16.4706 6.93096 16.2566 6.71067 16 6.54999C15.7209 6.37187 15.4006 6.26856 15.07 6.24999C14.9715 6.24671 14.8746 6.22406 14.7849 6.18333C14.6951 6.14261 14.6143 6.08461 14.547 6.01264C14.4797 5.94068 14.4272 5.85616 14.3925 5.7639C14.3579 5.67165 14.3417 5.57348 14.345 5.47499C14.3483 5.3765 14.3709 5.27962 14.4116 5.18988C14.4524 5.10014 14.5104 5.0193 14.5823 4.95198C14.6543 4.88466 14.7388 4.83217 14.8311 4.79751C14.9233 4.76285 15.0215 4.74671 15.12 4.74999C15.9727 4.78201 16.7819 5.1344 17.3862 5.73683C17.9905 6.33926 18.3454 7.14742 18.38 7.99999C18.384 8.0985 18.3686 8.19684 18.3345 8.28937C18.3005 8.38191 18.2486 8.46683 18.1817 8.53927C18.1148 8.61172 18.0343 8.67027 17.9448 8.71158C17.8553 8.75288 17.7585 8.77613 17.66 8.77999L17.63 8.76999Z M13 13.36H10.53C10.3311 13.36 10.1403 13.281 9.99967 13.1403C9.85902 12.9997 9.78 12.8089 9.78 12.61V10.09C9.78017 9.89115 9.85931 9.70051 10 9.56L15 4.56C15.0689 4.48924 15.1514 4.433 15.2424 4.39461C15.3334 4.35621 15.4312 4.33643 15.53 4.33643C15.6288 4.33643 15.7266 4.35621 15.8176 4.39461C15.9086 4.433 15.9911 4.48924 16.06 4.56L16.92 5.42C16.9946 5.49425 17.0528 5.58337 17.0907 5.68158C17.1286 5.77978 17.1454 5.88487 17.14 5.99C17.2451 5.98523 17.35 6.00233 17.4481 6.04019C17.5462 6.07806 17.6354 6.13588 17.71 6.21L18.58 7.07C18.7204 7.21062 18.7993 7.40124 18.7993 7.6C18.7993 7.79875 18.7204 7.98937 18.58 8.13L13.58 13.13C13.504 13.2057 13.4134 13.2651 13.3137 13.3047C13.214 13.3442 13.1072 13.363 13 13.36ZM11.24 11.86H12.69L17 7.57L16.66 7.24C16.5869 7.16468 16.5297 7.07538 16.4919 6.97743C16.4541 6.87949 16.4364 6.77492 16.44 6.67C16.3349 6.67538 16.2298 6.65857 16.1316 6.62067C16.0334 6.58277 15.9442 6.52461 15.87 6.45L15.54 6.12L11.28 10.4L11.24 11.86Z M18.08 8.31999C17.8811 8.31982 17.6905 8.24069 17.55 8.1L16.68 7.24C16.6069 7.16468 16.5497 7.07538 16.5119 6.97743C16.4741 6.87949 16.4564 6.77492 16.46 6.67C16.3549 6.67538 16.2498 6.65857 16.1516 6.62067C16.0534 6.58277 15.9642 6.52461 15.89 6.45L15 5.59C14.8595 5.44937 14.7807 5.25875 14.7807 5.05999C14.7807 4.86124 14.8595 4.67062 15 4.53L17.55 1.99999C17.6906 1.85954 17.8812 1.78065 18.08 1.78065C18.2787 1.78065 18.4694 1.85954 18.61 1.99999L21.11 4.51C21.1808 4.57894 21.237 4.66136 21.2754 4.75238C21.3138 4.84341 21.3336 4.9412 21.3336 5.03999C21.3336 5.13879 21.3138 5.23658 21.2754 5.32761C21.237 5.41863 21.1808 5.50105 21.11 5.57L18.61 8.1C18.4695 8.24069 18.2788 8.31982 18.08 8.31999ZM17.21 6C17.3088 5.99777 17.4069 6.01618 17.4982 6.05406C17.5895 6.09195 17.6718 6.14846 17.74 6.21999L18.08 6.55L19.52 5.09999L18.08 3.60999L16.62 5.05999L16.95 5.38999C17.0246 5.46425 17.0828 5.55337 17.1207 5.65158C17.1586 5.74978 17.1754 5.85487 17.17 5.96L17.21 6Z" />
                <mask id="vc-prefix-msg-mask">
                    <path fill="#fff" d="M0 0h24v24H0Z" />
                    <path stroke="#000" stroke-width="5.99068" d="M0 24 24 0" />
                </mask>
                <path fill="var(--status-danger)" d="m21.178 1.70703 1.414 1.414L4.12103 21.593l-1.414-1.415L21.178 1.70703Z" />
            </svg >
        ),
    },
    {
        prefix: "LilC",
        svg: () => <span>Casper</span>,
    },
    {
        prefix: "Crystal (Lil)",
        svg: () => <span>Crystal (Little)</span>,
    },
    {
        prefix: "Crystal",
        svg: () => <span>Crystal (Big)</span>,
    },
    {
        prefix: "Patch (Geek)",
        svg: () => <span>Patch (Geek)</span>,
    },
    {
        prefix: "Will (Dad)",
        svg: () => <span>Will (Dad)</span>,
    },
    {
        prefix: "John (Work)",
        svg: () => <span>John (Work)</span>,
    },
    {
        prefix: "David",
        svg: () => <span>David</span>,
    },
    {
        prefix: "Sam",
        svg: () => <span>Sam</span>,
    },
];

let stateIndex = 0;

const settings = definePluginSettings({
    persistState: {
        type: OptionType.BOOLEAN,
        description: "Whether to persist the state of the prefix message toggle when changing channels",
        default: false,
        onChange(newValue: boolean) {
            if (newValue === false) lastState = 0;
        }
    },
    autoDisable: {
        type: OptionType.BOOLEAN,
        description: "Automatically disable the prefix message toggle again after sending one",
        default: true
    }
});

const PrefixifyToggle: ChatBarButtonFactory = ({ isMainChat }) => {
    const [enabled, setState] = useState(lastState);
    function setPrefixValue(value: number) {
        value %= states.length;
        logger.info("Set value: " + value + "/" + states.length);
        if (settings.store.persistState) lastState = value;
        stateIndex = value;
        setState(value);
    }
    return (
        <ChatBarButton
            tooltip={enabled ? "Disable Prefix" : "Enable Prefix"}
            onClick={() => setPrefixValue(stateIndex + 1)}
            buttonProps={{
                "aria-haspopup": "dialog",
            }}
        >
            {states[stateIndex]?.svg()}
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "Prefixify",
    description: "Add a prefix to your chat messages",
    authors: [{ name: "Casper", id: 1126522528198836336n }],
    dependencies: ["MessageEventsAPI", "ChatInputButtonAPI"],
    settings,
    onBeforeMessageSend(channelId, message) {
        if (stateIndex !== 0) {
            const prefix = "**[" + states[stateIndex].prefix + "]:** ";
            if (settings.store.autoDisable) {
                const [enabled, setState] = useState(lastState);
                function setPrefixValue(value: number) {
                    value %= states.length;
                    logger.info("Set value: " + value + "/" + states.length);
                    if (settings.store.persistState) lastState = value;
                    stateIndex = value;
                    setState(value);
                }
                setPrefixValue(0);
            }
            if (!message.content.startsWith(prefix)) message.content = prefix + message.content;
        }
    },
    renderChatBarButton: PrefixifyToggle,
});
