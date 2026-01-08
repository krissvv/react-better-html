import { forwardRef, memo, useEffect } from "react";
import { AnyOtherString, AssetName, OmitProps, useBetterCoreContext, useTheme } from "react-better-core";
import styled from "styled-components";

import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";

import { useComponentPropsGrouper, useComponentPropsWithPrefix } from "../utils/hooks";

import Div from "./Div";
import Text from "./Text";

const ImageElement = styled.img.withConfig({
   shouldForwardProp: (prop) => !["style", "hoverStyle"].includes(prop),
})<{ style: ComponentStyle; hoverStyle: ComponentStyle }>`
   display: block;
   user-select: none;
   -webkit-user-drag: none;

   ${(props) => props.style as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type ImageProps = {
   name?: AssetName | AnyOtherString;
} & OmitProps<React.ComponentProps<"img">, "style"> &
   ComponentStyle &
   ComponentHoverStyle;

type ImageComponent = {
   (props: ComponentPropWithRef<HTMLImageElement, ImageProps>): React.ReactElement;
   profileImage: (
      props: ComponentPropWithRef<
         HTMLImageElement,
         OmitProps<ImageProps, "width" | "height"> & {
            /** @default 40 */
            size?: number;
            letters?: string;
            backgroundColor?: string;
         }
      >,
   ) => React.ReactElement;
};

const Image: ImageComponent = forwardRef(function Image(
   { name, src, ...props }: ImageProps,
   ref: React.ForwardedRef<HTMLImageElement>,
) {
   const { assets } = useBetterCoreContext();

   const { style, hoverStyle, restProps } = useComponentPropsGrouper(props);
   const dataProps = useComponentPropsWithPrefix(restProps, "data");
   const ariaProps = useComponentPropsWithPrefix(restProps, "aria");

   useEffect(() => {
      if (!name) return;

      if (!assets[name.toString()])
         console.warn(
            `The asset \`${name}\` you are trying to use does not exist. Make sure to add it to the \`assets\` object in \`<BetterHtmlProvider>\` config value prop.`,
         );
   }, [assets, name]);

   return (
      <ImageElement
         src={name ? assets[name.toString()] : src}
         style={style}
         hoverStyle={hoverStyle}
         {...restProps}
         {...dataProps}
         {...ariaProps}
         ref={ref}
      />
   );
}) as any;

Image.profileImage = forwardRef(function ProfileImage({ size = 40, letters, backgroundColor, ...props }, ref) {
   const theme = useTheme();

   return letters ? (
      <Div.row
         backgroundColor={backgroundColor ?? theme.colors.backgroundSecondary}
         border={`solid 1px ${theme.colors.border}`}
         borderRadius={999}
         alignItems="center"
         justifyContent="center"
         ref={ref}
         {...props}
         width={size}
         height={size}
      >
         <Text fontSize={size / 2.5} fontWeight={700}>
            {letters.toUpperCase().slice(0, 2)}
         </Text>
      </Div.row>
   ) : (
      <Image
         width={size}
         height={size}
         border={`solid 1px ${theme.colors.border}`}
         borderRadius={999}
         objectFit="cover"
         ref={ref}
         {...props}
      />
   );
}) as ImageComponent["profileImage"];

const MemoizedImage = memo(Image) as any as typeof Image & {
   profileImage: typeof Image.profileImage;
};

MemoizedImage.profileImage = Image.profileImage;

export default { Image: MemoizedImage }.Image;
